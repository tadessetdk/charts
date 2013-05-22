//Written by Tadesse D. Feyissa. May 21, 2013.

function drawStackedBarChart(options){

    var lgd = options.legend;
    var xAxis = options.xAxis;
    var yAxis = options.yAxis;
    
    var x0 = xAxis.begin;
    var y0 = yAxis.begin;   
    var xf = xAxis.end;
    var yf = yAxis.end;
            
    var cv = options.canvas.getContext('2d');
    
    //draw title
    cv.font = 'bold 18px sans-serif';
    cv.font = options.title.font;
    cv.fillStyle = options.title.color;
    cv.fillText(options.title.label, options.title.position.x, options.title.position.y);
   
    cv.font = options.graph.font;
    cv.strokeStyle = xAxis.lineColor;
    
    cv.beginPath();
    cv.moveTo(x0, y0);
    cv.lineTo(xf, y0); // x - axis
    
    cv.font = options.graph.font;
    cv.strokeStyle = yAxis.lineColor;
    cv.moveTo(x0,y0);
    cv.lineTo(x0, yf); // y - axis                  
    cv.stroke();
    
    //draw axes labels
    cv.textAlign = 'center';
    cv.fillText(xAxis.label, xf - xAxis.axisLabelOffset.fromEnd, y0 + xAxis.axisLabelOffset.fromAxis);
    cv.fillText(yAxis.label, x0 + yAxis.axisLabelOffset.fromAxis, yf - yAxis.axisLabelOffset.fromEnd);

    var data = options.dataSeries;
    
    //get series sums
    var seriesSums = [];
    for(var i = 0 ; i < data.categories.length ; i++)
    {
        var d = data.categories[i];
        var sum = 0;
        for (var j = 0 ; j < d.series.length ; j++){
            sum += d.series[j];
        }

        seriesSums.push(sum);
    } 

    //draw axes labels
    var maxY = seriesSums[0];
    var minY = maxY;
    
    for(var i = 1; i < seriesSums.length ; i++){
        var y = seriesSums[i];
        maxY = maxY < y ? y : maxY;
        minY = minY > y ? y : minY;
    }
    
    //user needs to optionally pass minY value; the data range may not have a good one.
    minY = 0;
    var width = (xf - xAxis.lastTickOffset) - x0;
    var height = (y0 - yAxis.lastTickOffset) - yf;
    
    //draw x and y-axes labels
    cv.font = yAxis.font;
    cv.strokeStyle = yAxis.labelColor;
    
    var ns = new niceScale(0, maxY, yAxis.maxTicks);
    var yMin = ns.niceMin;
    var yMax = ns.niceMax;
    var ySpace = ns.tickSpacing;
    var yPixel = height / (yMax - yMin); //height in pixel per unit
    
   var lableDistanceFromYAxis = yAxis.dataLabelOffset || 15;
    cv.textAlign = 'right';
    for(var i = minY; i <= maxY ; i += ySpace)
    {
        cv.fillText(i, x0 - lableDistanceFromYAxis, y0 - i * yPixel);
    }
                            
    //draw bars
    var rectangles = [];
    for(var i = 0 ; i < data.categories.length ; i++)
    {
        drawRect(data.categories[i], data.legends, i);
    }

    drawLegends(data.legends);

    //chart events
    var prevHighlight;
    var events = options.events;
    if(events.click || events.mouseover){
      var canvas = $(options.canvas);
      canvas.mousemove(function(e){
          var x = e.pageX - $(this).offset().left - parseInt($(this).css('padding-left'));
          var y = e.pageY - $(this).offset().top - parseInt($(this).css('padding-top'));
         
          if(prevHighlight){
              canvas.unbind('click');
              $(this).css({cursor: 'auto'});
              cv.restore();
              var a = prevHighlight;
              drawStackRect(a.series, a.legend, a.x, a.yref, a.position, false);
          }

          for(var i in rectangles){
              var a = rectangles[i];
              if(isInRectangle({x: x, y: y}, a)){
                  
                  cv.save();
                  prevHighlight = a;
                  drawStackRect(a.series, a.legend, a.x, a.yref, a.position, true);
                  $(this).css({cursor: 'pointer'});
                  
                  if(events.click){
                      canvas.unbind('click').bind('click', {x: x, y: y, data: a}, events.click);
                  }
                  
                  if(events.mouseover){
                      events.mouseover({e: e, data: {x: x, y: y, data: a}});
                  }
      
                  break;
              }

          }
      });
    }
    
    var lableDistanceFromXAxis = xAxis.dataLabelOffset || 15;
    var barWidth = options.graph.barWidth, barPadding = options.graph.barPadding;

    function drawRect(category, legends, position, redraw, highlight){
        window.setTimeout(function(){
            var x = x0 + (position + 1) * barPadding + position * barWidth;  
            var yref = y0;
            for(var i = category.series.length - 1 ; i >= 0 ; i--){
                var result = drawStackRect(category.series[i], legends[i], x, yref, position, highlight);
                result['categoryName'] = category.name;
                rectangles.push(result);
                yref =  result.y;
            }

            //legend
            if(!redraw){
                cv.fillStyle = xAxis.labelColor; 
                cv.textAlign = 'center';
                cv.font = xAxis.font;
                cv.fillText(category.name, x + barWidth / 2, y0 + lableDistanceFromXAxis);
            }
            
        }, 100 * (position + 1));
    }

    function drawStackRect(series, legend, x, yref, position, highlight){
        var color = legend.color;
        var h = series * yPixel;
        var y = yref - h;
        
        var grad = cv.createLinearGradient(x + barWidth, y + h, x, y);
        grad.addColorStop((highlight ? 0.9 : 0.7), color);
        grad.addColorStop(1, '#FFF');
        cv.fillStyle = grad;     
        
        cv.beginPath();
        cv.fillRect(x, y, barWidth, h);
        cv.strokeStyle = color;
        cv.strokeRect(x, y, barWidth, h);

        return {x: x, y: y, yref: yref, width: barWidth, height: h, series: series, legend: legend, position: position};
    }
    
    function drawLegends(legends){
        var x = xf - lgd.left;
        var y = lgd.top;

        cv.fillStyle =lgd.caption.color;
        cv.textAlign = 'left';
        cv.font = lgd.caption.font;
        cv.fillText(lgd.caption.label, x, y);

        cv.font = lgd.font;
        var textTopPadding = lgd.textTopPadding;
        y += lgd.box.verticalMargin;
        for(var i = 0; i < legends.length ; i++){
            cv.fillStyle = legends[i].color;
            cv.fillRect(x, y - textTopPadding, lgd.box.height, lgd.box.width);
            cv.fillStyle = lgd.textColor;
            cv.fillText(legends[i].name, x + lgd.box.textLeftMarin, y);
            y += lgd.box.verticalMargin;
        }
    }

    function isInRectangle(p, rect){
       return p.x >= rect.x && p.x <= (rect.x + rect.width) && p.y >= rect.y && p.y <= (rect.y + rect.height);
    }
};
