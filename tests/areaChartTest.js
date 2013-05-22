//Written by Tadesse D. Feyissa. May 21, 2013.

var th; 
var graphOptions = {
    canvas: $('#canvas3')[0],
    
    graph: {
      font: 'normal 11px verdana',
      strokeStyle: '#08F',
      pointFillStyle:'#0099CC', 
      activePointFillStyle: '#FF9900',
      activePointStrokeStyle: '#F00',
      stacked: false
    },
     
    dataSeries: [{ fillStyle: '#87AAAE', data: [[0,8], [1,7], [2,9], [3,10], [4,9], [5,10], [5.4,8], [6,6.5], [6.4,7], [7,12], [7.5,11], [8,12]] },
                        { fillStyle: '#0099CC', data: [[0,5], [1,5], [2,6], [3,6], [4,6.3], [5,5], [5.4,5], [6,6], [6.4,6], [7,8], [7.5,10], [8,8]] },
                        { fillStyle: '#E2DC24', data: [[0,6], [1,3], [2,7], [3,6], [4,6], [5,7], [5.4,5.4], [6,8], [6.4,6], [7,8], [7.5,11], [8,9]] }],
    
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
        label: 'Area Chart',
        position : {x:10, y:15},
        font: 'bold 18px sans-serif',
        color: '#336699'
    },
    
};
 
drawAreaGraph(graphOptions);

var graphOptions1 = {
    canvas: $('#canvas4')[0],
    
    graph: {
      font: 'normal 11px verdana',
      strokeStyle: '#08F',
      pointFillStyle:'#0099CC', 
      activePointFillStyle: '#FF9900',
      activePointStrokeStyle: '#F00',
      stacked: true
    },
     
    dataSeries: [{ fillStyle: '#87AAAE', data: [[0,8], [1,7], [2,9], [3,10], [4,9], [5,10], [5.4,8], [6,6.5], [6.4,7], [7,12], [7.5,11], [8,12]] },
                        { fillStyle: '#0099CC', data: [[0,5], [1,5], [2,6], [3,6], [4,6.3], [5,5], [5.4,5], [6,6], [6.4,6], [7,8], [7.5,10], [8,8]] },
                        { fillStyle: '#E2DC24', data: [[0,6], [1,3], [2,7], [3,6], [4,6], [5,7], [5.4,5.4], [6,8], [6.4,6], [7,8], [7.5,11], [8,9]] }],
    
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
        label: 'Stacked Area Chart',
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
 
drawAreaGraph(graphOptions1);
