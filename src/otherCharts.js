//Written by Tadesse D. Feyissa. May 17, 2013.

function drawAreaGraph(canvasId, stacked){
            var x0 = 50;
            var y0 = 350;   
            var xf = 600;
            var yf = 50;
                    
            var canvas = $('#'+canvasId);
            var cv = canvas[0].getContext('2d');
            
            
            //draw title
            cv.font = 'bold 18px sans-serif';
            cv.fillStyle = '#336699';
            cv.fillText(stacked ? 'Stacked area chart' : 'Area chart', 10, 15);


            cv.font = 'normal 11px verdana';
            cv.strokeStyle = '#000';
            cv.lineJoin = 'round';
           
            cv.beginPath();
            cv.moveTo(x0,y0);
            cv.lineTo(xf, y0); // x - axis
            cv.moveTo(x0,y0);
            cv.lineTo(x0, yf); // y - axis                  
            cv.stroke();
            
            cv.textAlign = 'center';
            cv.fillText('x-axis', xf - 20, y0 + 30);
            cv.fillText('y-axis', x0 - 20, yf - 5);
            
            var data = [{ fillStyle: '#87AAAE', data: [[0,8], [1,7], [2,9], [3,10], [4,9], [5,10], [5.4,8], [6,6.5], [6.4,7], [7,12], [7.5,11], [8,12]] },
                        { fillStyle: '#0099CC', data: [[0,5], [1,5], [2,6], [3,6], [4,6.3], [5,5], [5.4,5], [6,6], [6.4,6], [7,8], [7.5,10], [8,8]] },
                        { fillStyle: '#E2DC24', data: [[0,6], [1,3], [2,7], [3,6], [4,6], [5,7], [5.4,5.4], [6,8], [6.4,6], [7,8], [7.5,11], [8,9]] }];

            if(stacked){
                data = generateStackedAreaData(data);
            }
               
            var mm = getMinMax(data);
            var maxX = mm.maxX;
            var minX = mm.minX;
            var maxY = mm.maxY;
            var minY = mm.minY;
            
            //user needs to optionally pass this values; the data range may not have them.
            minX = minY = 0;
            var offset = 20;
            var width = (xf - offset) - x0;
            var height = (y0 - offset) - yf;
            
            //draw x- and y-axes labels
            cv.font = 'normal 9px verdana';
            cv.strokeStyle = '#000';
            
            var ns = new niceScale(0, maxX);
            var xMin = ns.niceMin;
            var xMax = ns.niceMax;
            var xSpace = ns.tickSpacing;
            var xPixel = width / (xMax - xMin); //width in pixel per unit
            
            ns = new niceScale(0, maxY);
            var yMin = ns.niceMin;
            var yMax = ns.niceMax;
            var ySpace = ns.tickSpacing;
            var yPixel = height / (yMax - yMin); //height in pixel per unit
            
            var lableDistanceFromAxis = 15;
            
            cv.textAlign = 'center';
            for(var i = minX; i <= maxX ; i += xSpace)
            {
                cv.fillText(i, x0 + i * xPixel ,y0 + lableDistanceFromAxis);
            }
            
            cv.textAlign = 'right';
            for(var i = minY; i <= maxY ; i += ySpace)
            {
                cv.fillText(i, x0 - lableDistanceFromAxis, y0 - i * yPixel);
            }
            
            //draw reference horizontal and vertical fade dotted lines
            cv.strokeStyle = '#DDD';
            cv.lineWidth = 0.75;
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
            
            drawAreas(data, stacked);
            
            if(stacked){
                //chart events only for stacked areas; otherwise it overlaps and not possible to tell which area is in focus
                var prevHighlight = -1;
                canvas.mousemove(function(e){

                    var x = e.pageX - $(this).offset().left - parseInt($(this).css('margin-left')) - parseInt($(this).css('padding-left')) - x0;
                    var y = y0 - e.pageY + $(this).offset().top + parseInt($(this).css('margin-top')) + parseInt($(this).css('padding-top'));
  
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
                         
                            if(prevHighlight != areaFound)
                            {
                                canvas.css({cursor: 'pointer'});
                                
                                //cancel previous one and plot the highlight
                                if(prevHighlight >= 0){
                                    drawUpperBoundGraph(data[prevHighlight], true);
                                }

                                drawUpperBoundGraph(data[areaFound], true, true);

                                prevHighlight = areaFound;
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
                 hex = hex.charAt(0) == '#' ? hex.substring(1) : hex;
                 var c = parseInt(hex, 16);
                 var r = 255 - (c >> 16 & 255);
                 var g = 255 - (c >> 8 & 255);
                 var b = 255 - (c & 255);
                 return 'rgb(' + r + ',' + g + ',' + b + ')';
            }

            function getContrast(hex){
                 hex = hex.charAt(0) == '#' ? hex.substring(1) : hex;
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

                    if(j == 0 ){
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

        drawAreaGraph('canvas3');
        drawAreaGraph('canvas4', true);
        
        function drawStackedBarChart(data, canvasId){

            var x0 = 50;
            var y0 = 350;   
            var xf = 600;
            var yf = 50;
                    
            var canvas = $('#' + canvasId);
            var cv = canvas[0].getContext('2d');
            
            //draw title
            cv.font = 'bold 18px sans-serif';
            cv.fillStyle = '#336699';
            cv.fillText('Stacked column chart', 10, 15);


            cv.font = 'normal 11px verdana';
            cv.strokeStyle = '#000';
            
            cv.beginPath();
            cv.moveTo(x0,y0);
            cv.lineTo(xf, y0); // x - axis
            cv.moveTo(x0,y0);
            cv.lineTo(x0, yf); // y - axis
                    
            cv.stroke();
            
            //draw axes labels
            cv.textAlign = 'center';
            cv.fillText('Country', xf - 40, y0 + 15);
            cv.fillText('Amount', x0 + 10, yf - 5);
            
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
            var offset = 20;
            var height = (y0 - offset) - yf;
            var width = (xf - offset) - x0;
            
            //draw x and y-axes labels
            cv.font = 'normal 9px verdana';
            cv.strokeStyle = '#000';
            
            var ns = new niceScale(0, maxY);
            var yMin = ns.niceMin;
            var yMax = ns.niceMax;
            var ySpace = ns.tickSpacing;
            var yPixel = height / (yMax - yMin); //height in pixel per unit
            
            var lableDistanceFromAxis = 15;
            cv.textAlign = 'right';
            for(var i = minY; i <= maxY ; i += ySpace)
            {
                cv.fillText(i, x0 - lableDistanceFromAxis, y0 - i * yPixel);
            }
                                    
            //draw bars
            var barWidth = 60, padding = 40;
            var rectangles = [];
            for(var i = 0 ; i < data.categories.length ; i++)
            {
                drawRect(data.categories[i], data.legends, i);
            }

            drawLegends(data.legends);

            //chart events
            var prevHighlight;
            canvas.mousemove(function(e){
                var x = e.pageX - $(this).offset().left - parseInt($(this).css('margin-left')) - parseInt($(this).css('padding-left'));
                var y = e.pageY - $(this).offset().top - parseInt($(this).css('margin-top')) - parseInt($(this).css('padding-top'));
               
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

                        canvas.bind('click', function(e){
                           $('#t').text(parseInt(a.x) + ', ' + parseInt(a.y)); 
                        });
            
                        break;
                    }

                }
            });
            
            function drawRect(category, legends, position, redraw, highlight){
                window.setTimeout(function(){
                    var x = x0 + (position + 1) * padding + position * barWidth;  
                    var yref = y0;
                    for(var i = category.series.length - 1 ; i >= 0 ; i--){
                        var result = drawStackRect(category.series[i], legends[i], x, yref, position, highlight);
                        rectangles.push(result);
                        yref =  result.y;
                    }

                    //legend
                    if(!redraw){
                        cv.fillStyle = '#777'; // category color
                        cv.textAlign = 'center';
                        cv.font = 'bold 9px tahoma';
                        cv.fillText(category.name, x + barWidth / 2, y0 + lableDistanceFromAxis);
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
                var x = xf - 100;
                var y = 50;

                cv.fillStyle = '#777';
                cv.textAlign = 'left';
                cv.font = 'bold 12px tahoma';
                cv.fillText('Legend', x, y);

                y += 24;
                cv.font = '12px tahoma';
                for(var i = 0; i < legends.length ; i++){
                    cv.fillStyle = legends[i].color;
                    cv.fillRect(x, y - 16, 20, 20);
                    cv.fillStyle = '#333';
                    cv.fillText(legends[i].name, x + 25, y);
                    y += 24;
                }
            }

            function isInRectangle(p, rect){
               return p.x >= rect.x && p.x <= (rect.x + rect.width) && p.y >= rect.y && p.y <= (rect.y + rect.height);
            }
        }

        drawStackedBarChart({ legends:[{name:'GDP', color:'#F50'},{name:'Revenue', color:'#91C3DC'},{name:'Deficit', color:'#999'}], 
                              categories:[{name:'USA', series:[55,67,76]}, {name:'Japan', series:[35,53,60]}, {name:'Germany', series:[40,57,60]}]} , 
                    'canvas5');
        
        function niceScale(min, max, maxTicks) {
     
            var m = this;
            maxTicks = maxTicks || 10;       
            var minPoint = min;
            var maxPoint = max;
            
            m.tickSpacing = 0;
            m.niceMin = 0;
            m.niceMax = 0;        
            
            (function() {
                var range = niceNum(maxPoint - minPoint, false);
                m.tickSpacing = niceNum(range / (maxTicks - 1), true);
                m.niceMin = Math.floor(minPoint / m.tickSpacing) * m.tickSpacing;
                m.niceMax = Math.ceil(maxPoint / m.tickSpacing) * m.tickSpacing;
            }());
     
            function niceNum(range, round) {
                var exponent; /** exponent of range */
                var fraction; /** fractional part of range */
                var niceFraction; /** nice, rounded fraction */
     
                exponent = Math.floor(Math.log(range) / Math.log(10));
                fraction = range / Math.pow(10, exponent);
     
                if (round) {
                        if (fraction < 1.5)
                            niceFraction = 1;
                        else if (fraction < 3)
                            niceFraction = 2;
                        else if (fraction < 7)
                            niceFraction = 5;
                        else
                            niceFraction = 10;
                } 
                else {
                        if (fraction <= 1)
                            niceFraction = 1;
                        else if (fraction <= 2)
                            niceFraction = 2;
                        else if (fraction <= 5)
                            niceFraction = 5;
                        else
                            niceFraction = 10;
                }
     
                return niceFraction * Math.pow(10, exponent);
            }
        }
       