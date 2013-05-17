//Written by Tadesse D. Feyissa. May 17, 2013.

function drawGraph(options){
  
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
      cv.lineJoin = 'round';

      cv.font = options.graph.font;
      cv.strokeStyle = xAxis.lineColor;
     
      cv.beginPath();
      cv.moveTo(x0,y0);
      cv.lineTo(xf, y0); // x - axis
      
      cv.font = options.graph.font;
      cv.strokeStyle = yAxis.lineColor;
      cv.moveTo(x0,y0);
      cv.lineTo(x0, yf); // y - axis                  
      cv.stroke();
      
      cv.textAlign = 'center';
      
      cv.fillText(xAxis.label, xf - xAxis.axisLabelOffset.fromEnd, y0 + xAxis.axisLabelOffset.fromAxis);
      cv.fillText(yAxis.label, x0 + yAxis.axisLabelOffset.fromAxis, yf - yAxis.axisLabelOffset.fromEnd);
      
      var data = options.dataSeries;
         
      var maxX = data[0][0];
      var minX = maxX;
      var maxY = data[0][1];
      var minY = maxY;
      
      for(var i = 1; i < data.length ; i++){
          var x = data[i][0];
          var y = data[i][1];
          maxX = maxX < x ? x : maxX;
          minX = minX > x ? x : minX;
          
          maxY = maxY < y ? y : maxY;
          minY = minY > y ? y : minY;
      }
      
      //user needs to optionally pass this values; the data range may not have them.
      minX = minY = 0;
      var width = (xf - xAxis.lastTickOffset) - x0;
      var height = (y0 - yAxis.lastTickOffset) - yf;
      
      //draw x-axis abels
      cv.font = xAxis.font;
      cv.strokeStyle = xAxis.labelColor;
      
      var ns = new niceScale(0, maxX, xAxis.maxTicks);
      var xMin = ns.niceMin;
      var xMax = ns.niceMax;
      var xSpace = ns.tickSpacing;
      var xPixel = width / (xMax - xMin); //width in pixel per unit
         
      var lableDistanceFromXAxis = xAxis.dataLabelOffset || 15;
      
      cv.textAlign = 'center';
      for(var i = minX; i <= maxX ; i += xSpace)
      {
          cv.fillText(i, x0 + i * xPixel ,y0 + lableDistanceFromXAxis);
      }
     
      //draw y-axis labels
      cv.font = yAxis.font;
      cv.strokeStyle = yAxis.labelColor;
    
      ns = new niceScale(0, maxY, yAxis.maxTicks);
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
      
      //draw reference horizontal and vertical fade dotted lines
      cv.strokeStyle = options.grid.color;
      cv.lineWidth = options.grid.lineWidth;
      for(var i = minX + xSpace; i <= maxX ; i += xSpace)
      {
          cv.moveTo(x0 + i * xPixel, y0);
          cv.lineTo(x0 + i * xPixel, y0 - height);
      }
      
      for(var i = minY + ySpace; i <= maxY ; i += ySpace)
      {
          cv.moveTo(x0, y0 - i * yPixel);
          cv.lineTo(x0 + width, y0 - i * yPixel);
      }
      
      cv.stroke();
      
      //draw graph
      cv.strokeStyle = options.graph.strokeStyle;    
      cv.fillStyle = options.graph.pointFillStyle;    

      var radius = 5;
      var arcs = {r: radius, centers: []};
      for(var i = 0; i < data.length ; i++){
          var d = data[i];
          var xOffset = d[0] * xPixel;
          var yOffset = d[1] * yPixel;
          var x = x0 + xOffset;
          var y = y0 - yOffset;

          if(i == 0 ){
              cv.moveTo(x, y);
          }

          if(i > 0 ){
              cv.lineTo(x, y);
              cv.stroke();
          }

          cv.beginPath(); 
          cv.arc(x, y, radius, 0,2 * Math.PI);
          arcs.centers.push({x: x,y: y, data: data[i]});
          cv.fill();
      }

      cv.closePath();
      
      //chart events
      var prevHighlight;
      var events = options.events;
      if(events.click || events.mouseover){
        $(options.canvas).mousemove(function(e){
          var x = e.pageX - $(this).offset().left - parseInt($(this).css('margin-left')) - parseInt($(this).css('padding-left'));
          var y = e.pageY - $(this).offset().top - parseInt($(this).css('margin-top')) - parseInt($(this).css('padding-top'));
         
          if(prevHighlight){
              $(options.canvas).unbind('click');
              $(this).css({cursor: 'auto'});
              cv.restore();
              cv.beginPath(); 
              cv.arc(prevHighlight.x, prevHighlight.y, radius, 0,2 * Math.PI);
              cv.fill();
          }
          
          for(var i in arcs.centers){
              var a = arcs.centers[i];
              if(isInCircle({x: x, y: y}, a)){
                  cv.save();
                  prevHighlight = a;
                  cv.beginPath(); 
                  cv.fillStyle = options.graph.activePointFillStyle;
                  cv.strokeStyle = options.graph.activePointStrokeStyle;    
                  cv.arc(a.x, a.y, radius, 0,2 * Math.PI);
                  cv.fill();
                  $(this).css({cursor: 'pointer'});

                  if(events.click){
                      $(options.canvas).unbind('click').bind('click', a, events.click);
                  }
      
                  if(events.mouseover){
                      events.mouseover({e: e, data: a});
                  }
                  
                  break;
              }

          }
      });
      }
      
      function isInCircle(p1, p2){
         var r = Math.sqrt(Math.pow((p2.x - p1.x), 2) + Math.pow((p2.y - p1.y), 2));
         return r <= radius + 5;
      }
  }