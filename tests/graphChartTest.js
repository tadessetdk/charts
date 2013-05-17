//Written by Tadesse D. Feyissa. May 17, 2013.

var canvas = $('#canvas2');
var cv = canvas[0];
var th;
      
var graphOptions = {
    canvas: cv,
    
    graph: {
      font: 'normal 11px verdana',
      strokeStyle: '#08F',
      pointFillStyle:'#0099CC', 
      activePointFillStyle: '#FF9900',
      activePointStrokeStyle: '#F00'
    },
     
    dataSeries: [
                    [0,5], [1,5], [2,6], [3,6], [4,6.3], [5,5], [5.4,5], [6,6], [6.4,6], [7,9], [7.5,12], [8,18], 
                    [8.6,22], [8.9, 24], [9.3, 25], [9.7,64], [10,18], [11,16], [11.5, 11], [12,122.3]
                 ],
    
    xAxis : {
        begin : 50,
        end: 600,
        label: 'x-axis',
        font: 'normal 9px verdana',
        lineColor: '#000',
        labelColor: '#000',
        axisLabelOffset: {fromEnd: 20 ,fromAxis: 30},
        dataLabelOffset: 15,
        lastTickOffset: 20,
        maxTicks: 10
     } , 
   
    yAxis: {
        begin: 350,
        end: 50,
        label: 'y-axis',
        font: 'normal 9px verdana',
        lineColor: '#000',
        labelColor: '#000',
        axisLabelOffset: {fromEnd: 5 ,fromAxis: -20},
        dataLabelOffset: 15,
        lastTickOffset: 20,
        maxTicks: 10
    },
    
    grid: { color: '#DDD', lineWidth: 0.75 },
    
    title: {
        label: 'Graph chart',
        position : {x:10, y:15},
        font: 'bold 18px sans-serif',
        color: '#336699'
    },
    
    events: {
        click: function(e){
                  var info = $('#graphInfo');
                  $('#content', info).html(JSON.stringify(e.data.data));
                  info.fadeIn('slow');
                  var offset = $(e.target).offset();
                  var l = offset.left + e.data.x + 20;
                  var t = offset.top + e.data.y + 20;
                  info.css({left: l, top: t});
                  
                  if(th) { 
                      window.clearTimeout(th); 
                      th = null; 
                  }
                  
                  th = window.setTimeout(function(){ 
                        info.fadeOut('slow');
                        th = null;
                    }
                  ,2000);
               }, 
               
              mouseover: function(e){
                  var info = $('#graphInfo');
                  $('#content', info).html(JSON.stringify(e.data));
                  info.fadeIn('slow');
                  var offset = $(e.e.target).offset();
                  var l = offset.left + e.data.x + 35;
                  var t = offset.top + e.data.y + 20;
                  info.css({left: l, top: t});
                  
                  if(th) { 
                      window.clearTimeout(th); 
                      th = null; 
                  }
                  
                  th = window.setTimeout(function(){ 
                        info.fadeOut('slow');
                        th = null;
                    }
                  ,1000);
              }
        }
 };
 
 drawGraph(graphOptions);