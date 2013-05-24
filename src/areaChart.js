//Written by Tadesse D. Feyissa. May 21, 2013.

function drawAreaGraph(options){
   
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
    cv.lineJoin = 'round';
   
    cv.beginPath();
    cv.moveTo(x0,y0);
    cv.lineTo(xf, y0); // x - axis
    
    cv.strokeStyle = yAxis.lineColor; 
    cv.moveTo(x0,y0);
    cv.lineTo(x0, yf); // y - axis                  
    cv.stroke();
    
    cv.textAlign = 'center';
    cv.fillText(xAxis.label, xf - xAxis.axisLabelOffset.fromEnd, y0 + xAxis.axisLabelOffset.fromAxis);
    cv.fillText(yAxis.label, x0 + yAxis.axisLabelOffset.fromAxis, yf - yAxis.axisLabelOffset.fromEnd);
    
    var data = options.dataSeries;
     
    if(options.graph.stacked){
        data = generateStackedAreaData(data);
    }
       
    var mm = getMinMax(data);
    var maxX = mm.maxX;
    var minX = mm.minX;
    var maxY = mm.maxY;
    var minY = mm.minY;
    
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
    
    drawAreas(data, options.graph.stacked);
    
    var canvas = $(options.canvas);
    var events = options.events;
    if(options.graph.stacked && (events.click || events.mouseover)){
        //chart events only for stacked areas; otherwise it overlaps and not possible to tell which area is in focus
        var prevHighlight = -1;
        canvas.mousemove(function(e){

            var xi = e.pageX - $(this).offset().left - parseInt($(this).css('padding-left'));
            var yi = e.pageY - $(this).offset().top - parseInt($(this).css('padding-top'));
            var x = xi - x0;
            var y = y0 - yi;

            //get the two x's in which the cursor is between
            var dt = data[0].data;
            var p1 = 0;
            var p2 = p1;
            var xFound = false;

            for(var i = 1 ; i < dt.length ; i++)
            {
                if(x > 0 && dt[i][0] > x)
                {
                    p2 = i;
                    xFound = true;
                    break;
                }

                p1 = i;
            }

            var areaFound = -1;
              
            if(xFound){
                
                //linear extrapolate y for each area, and determine if the currosY lies in between any two areas
                
                for(var i = 0 ; i < data.length ; i++){
                    dt = data[i].data;
                    var slope = (dt[p2][1] - dt[p1][1]) / (dt[p2][0] - dt[p1][0]);
                    var b = dt[p2][1] - slope * dt[p2][0];
                    var cursorY = slope * x + b;
                    if(y > 0 && y < cursorY)
                    {
                        areaFound = i;
                        break;
                    }
                }
            
                if(areaFound >= 0){
                 
                    if(prevHighlight !== areaFound)
                    {
                        canvas.css({cursor: 'pointer'});
                        
                        //cancel previous one and plot the highlight
                        if(prevHighlight >= 0){
                            drawUpperBoundGraph(data[prevHighlight], true);
                        }

                        drawUpperBoundGraph(data[areaFound], true, true);

                        prevHighlight = areaFound;
                    }
                    
                    var info = {x: xi, y: yi, data: data[areaFound]};
                    
                    if(events.click){
                        canvas.unbind('click').bind('click', info, events.click);
                    }
        
                    if(events.mouseover){
                        events.mouseover({e: e, data: info});
                    }
                    
                }
                else{
                    canvas.css({cursor: 'auto'});
                    
                    //redraw original graph
                    if(prevHighlight >= 0){
                        drawUpperBoundGraph(data[prevHighlight], true);
                    }
                    
                    prevHighlight = -1;
                }
            }
            else{
                canvas.css({cursor: 'auto'});
                
                //redraw original graph
                if(prevHighlight >= 0){
                    drawUpperBoundGraph(data[prevHighlight], true);
                }

                prevHighlight = -1;
            }
        });
    }

    function invertColor(hex){
         hex = hex.charAt(0) === '#' ? hex.substring(1) : hex;
         var c = parseInt(hex, 16);
         var r = 255 - (c >> 16 & 255);
         var g = 255 - (c >> 8 & 255);
         var b = 255 - (c & 255);
         return 'rgb(' + r + ',' + g + ',' + b + ')';
    }

    function getContrast(hex){
         hex = hex.charAt(0) === '#' ? hex.substring(1) : hex;
         return (parseInt(hex, 16) > 0xffffff/2) ? '#000' : '#FFF';
    }

    function generateStackedAreaData(d){
       
        for(var i = 1 ; i < d.length ; i++){
            for(var j = 0; j < d[i].data.length ; j++){
                d[i].data[j][1] += d[i-1].data[j][1]; 
            }
        }

        return d;
    }

    function drawUpperBoundGraph(d, redraw, highlight){
        
        cv.beginPath();
        cv.strokeStyle = highlight ? getContrast(d.fillStyle) : d.fillStyle;
        cv.globalCompositeOperation = highlight ? 'xor' : 'source-over';
       
        var x, y, yInit;
       
        for(var j = 0; j < d.data.length ; j++){
            var di = d.data[j];
            
            if(!redraw){
                di[0] = di[0] * xPixel;
                di[1] = di[1] * yPixel;
            }
            
            x = x0 + di[0];
            y = y0 - di[1];

            if(j === 0 ){
                yInit = y;
                cv.moveTo(x, y);
            }

            if(j > 0 ){
                cv.lineTo(x, y);
                cv.stroke();
            }
        }

        return {x: x, yInit: yInit };
    }

    function drawArea(d, stacked, position){
        window.setTimeout(function(){

            cv.fillStyle = d.fillStyle;
            cv.globalAlpha = stacked ? 1 : 0.5;    
            var result = drawUpperBoundGraph(d);

            //vertical-right
            cv.lineTo(result.x, y0);
            cv.stroke();
            
            //x-axis
            cv.lineTo(x0, y0);
            cv.stroke();

            //vertical-left
            cv.lineTo(x0, result.yInit);
            cv.stroke();

            cv.fill();

            cv.closePath();
        }, position * 100);
    }
    
    function drawAreas(datas, stacked){
        //draw areas
        for(var i = datas.length - 1; i >= 0 ; i--){
            drawArea(datas[i], stacked, datas.length - i);
        }
    }

    function isInCircle(p1, p2){
       var r = Math.sqrt(Math.pow((p2.x - p1.x), 2) + Math.pow((p2.y - p1.y), 2));
       return r <= radius + 5;
    }

    function getMinMax(d){

        var maxX = d[0].data[0][0];
        var minX = maxX;
        var maxY = d[0].data[0][1];
        var minY = maxY;
        
        for(var i = 0; i < d.length ; i++){
            for(var j = 0; j < d[i].data.length ; j++){
                var x = d[i].data[j][0];
                var y = d[i].data[j][1];
                maxX = maxX < x ? x : maxX;
                minX = minX > x ? x : minX;
                
                maxY = maxY < y ? y : maxY;
                minY = minY > y ? y : minY;
            }
        }

        return {maxX: maxX, minX: minX, maxY: maxY, minY: minY};
    }
}