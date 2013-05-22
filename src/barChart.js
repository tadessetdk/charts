//Written by Tadesse D. Feyissa. May 17, 2013.

function drawBarChart(options){

    var xAxis = options.xAxis;
    var yAxis = options.yAxis;
    
    var x0 = xAxis.begin;
    var y0 = yAxis.begin;   
    var xf = xAxis.end;
    var yf = yAxis.end;
            
    var cv = options.canvas.getContext('2d');
     
    //draw title
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
  
    //draw axes labels
    var data = options.dataSeries;
    var maxY = data[0].value;
    var minY = maxY;
    
    for(var i = 1; i < data.length ; i++){
        var y = data[i].value;
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
    for(var i = 0 ; i < data.length ; i++)
    {
        drawRect(data[i], i, rectangles);
    }

    //chart events
    var prevHighlight;
    var events = options.events;
    if(events.click || events.mouseover){
        $(options.canvas).mousemove(function(e){
            var x = e.pageX - $(this).offset().left - parseInt($(this).css('padding-left'));
            var y = e.pageY - $(this).offset().top - parseInt($(this).css('padding-top'));
           
            if(prevHighlight){
                $(options.canvas).unbind('click');
                $(this).css({cursor: 'auto'});
                cv.restore();
                drawRect(prevHighlight.data, prevHighlight.position, true);
            }

            for(var i in rectangles){
                var a = rectangles[i];
                if(isInRectangle({x: x, y: y}, a)){
                    
                    cv.save();
                    prevHighlight = {data: a.data, position: a.position};
                    drawRect(a.data, a.position, true, true);
                    $(this).css({cursor: 'pointer'});

                    if(events.click){
                      $(options.canvas).unbind('click').bind('click', {x: x, y: y, data: a}, events.click);
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
   
    function drawRect(d, position, redrawOrRectangles, highlight){
        var p = highlight || redrawOrRectangles === true ? -1 : position;
        window.setTimeout(function(){
            var h = d.value * yPixel;
            var x = x0 + (position + 1) * barPadding + position * barWidth;  
            var y = y0 - h;

            var grad = cv.createLinearGradient(x + barWidth, y + h, x, y);
            grad.addColorStop((highlight ? 0.9 : 0.7), d.color);
            grad.addColorStop(1, '#FFF');
            cv.fillStyle = grad;     
            
            cv.beginPath();
            cv.fillRect(x, y, barWidth, h);
            cv.strokeStyle = d.color;
            cv.strokeRect(x, y, barWidth, h);
            
            //legend
            if(redrawOrRectangles && redrawOrRectangles != true){
                cv.fillStyle = d.color; 
                cv.textAlign = 'center';
                cv.font = xAxis.font;
                cv.fillText(d.legend, x + barWidth / 2, y0 + lableDistanceFromXAxis);
            
                redrawOrRectangles.push({x: x, y: y, width: barWidth, height: h, data: d, position: position});
            }
            
        }, (p + 1) * 100);
    }

    function isInRectangle(p, rect){
       return p.x >= rect.x && p.x <= (rect.x + rect.width) && p.y >= rect.y && p.y <= (rect.y + rect.height);
    }
}