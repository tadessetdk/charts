//Written by Tadesse D. Feyissa. May 17, 2013.

var canvas = $('#canvas0');
var cv = canvas[0];
var th;
      
var barOptions = {
    canvas: cv,
   
    graph: {
      font: 'normal 11px verdana',
      strokeStyle: '#08F',
      pointFillStyle:'#0099CC', 
      activePointFillStyle: '#FF9900',
      activePointStrokeStyle: '#F00',
      barWidth: 40,
      barPadding: 25
    },    
         
    dataSeries: [{value:350, color:'#7E3817', legend:'USA'}, {value:150, color:'#F50', legend:'Japan'}, {value:70, color:'#30F', legend:'Sweden'}, 
                      {value:65, color:'#91C3DC', legend:'UK'}, {value:310, color:'#999', legend:'Euro'}, {value:300, color:'#C44', legend:'China'}],
      
    xAxis : {
        begin : 50,
        end: 600,
        label: 'Country',
        font: 'normal 9px verdana',
        lineColor: '#000',
        labelColor: '#000',
        axisLabelOffset: {fromEnd: 40 ,fromAxis: 15},
        dataLabelOffset: 15,
        lastTickOffset: 20,
        maxTicks: 10
     } , 
   
    yAxis: {
        begin: 350,
        end: 50,
        label: 'Annual Revenue',
        font: 'bold 9px tahoma',
        lineColor: '#000',
        labelColor: '#000',
        axisLabelOffset: {fromEnd: 5 ,fromAxis: 10},
        dataLabelOffset: 15,
        lastTickOffset: 20,
        maxTicks: 10
    },
    
    title: {
        label: 'Column chart',
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
 
drawBarChart(barOptions);