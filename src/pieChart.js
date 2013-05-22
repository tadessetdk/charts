//Written by Tadesse D. Feyissa. May 17, 2013.

function drawPieChart(options){

    var x0 = options.center.x;
    var y0 = options.center.y;
    var radius = options.radius;
    
    var cv = options.canvas.getContext('2d');
   
    //draw title
    cv.font = options.title.font;
    cv.fillStyle = options.title.color;
    cv.fillText(options.title.label, options.title.position.x, options.title.position.y);

    cv.font = options.graph.font;
    cv.textAlign = options.graph.textAlign;
    cv.strokeStyle = options.graph.strokeStyle;

    var data = options.dataSeries;
    
    var arcs = [];
    var begin = 0;
    for(var i in data){
        var d = data[i];
        var end = begin + (d.value * 2 / 100) * Math.PI;

        var modData = {begin: begin, end: end, data: d};
        drawPie(modData, i);
        arcs.push(modData);

        begin = end;
    }

    function drawPie(d, position, highlight){
        window.setTimeout(function(){
            var grad = cv.createRadialGradient(x0, y0, radius / 2, x0, y0, radius);
            grad.addColorStop(highlight ? 0.8 : 0.9, d.data.color);
            grad.addColorStop(1, '#FFF');
            cv.fillStyle = grad;    

            cv.beginPath();   
            cv.arc(x0, y0, radius, d.begin, d.end);
            cv.lineTo(x0,y0);
            cv.fill();
           
            rad = (d.begin + d.end) / 2;
            x = 2 * radius / 3 * Math.cos(rad);
            y = 2 * radius / 3 * Math.sin(rad);
            cv.fillStyle = "#FFF";
            cv.fillText(d.data.value + '% ' + d.data.legend, x0 + x, y0 + y);
        }, 100 * position);
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
              drawPie(prevHighlight, 0);
          }

          for(var i in arcs){
              var a = arcs[i];
              var result = isInArc({x: x, y: y}, a);
              if(result.inArc){
                  cv.save();

                  prevHighlight = a;
                  drawPie(a, 0, true);

                  $(this).css({cursor: 'pointer'});
                  
                  if(events.click){
                      $(options.canvas).unbind('click').bind('click', {x: x, y: y, arc: a, angle: result.angle}, events.click);
                  }
                  
                  if(events.mouseover){
                      events.mouseover({e: e, data: {x: x, y: y, arc: a, angle: result.angle}});
                  }
                  
                  break;
              }

          }
      });
    }
    
    function isInArc(p, arc){
       var r = Math.sqrt(Math.pow((p.x - x0), 2) + Math.pow((p.y - y0), 2));
       var rad = Math.abs(Math.atan((p.y - y0) / (p.x - x0)));
        switch(getQuadrant(p)){
            case 1:
                break;

            case 2:
                rad = Math.PI - rad;
                break;

            case 3:
                rad = Math.PI + rad;
                break;

            case 4:
                rad = 2 * Math.PI - rad;
                break;

        }
       
       return { inArc: (r <= radius && rad >= arc.begin && rad <= arc.end), angle: rad };
    }

    function getQuadrant(p){
        var dx = p.x - x0;
        var dy = p.y - y0;

        if(dx > 0){
            
            if(dy > 0){
                return 1;
            }

            return 4;
        }
        else{

            if(dy > 0){
                return 2;
            }

            return 3;
        }
    }

}
