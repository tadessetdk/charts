//Written by Tadesse D. Feyissa. May 21, 2013.

var th;
      
var barOptions = {
    canvas: $('#canvas5')[0],
   
    graph: {
      font: 'normal 11px verdana',
      strokeStyle: '#08F',
      pointFillStyle:'#0099CC', 
      activePointFillStyle: '#FF9900',
      activePointStrokeStyle: '#F00',
      barWidth: 60,
      barPadding: 40
    },    
         
    dataSeries: { legends:[{name:'GDP', color:'#F50'},{name:'Revenue', color:'#91C3DC'},{name:'Deficit', color:'#999'}], 
                  categories:[{name:'USA', series:[55,67,76]}, {name:'Japan', series:[35,53,60]}, {name:'Germany', series:[40,57,60]}]}, 
      
    xAxis : {
        begin : 50,
        end: 600,
        label: 'Country',
        font: 'bold 11px verdana',
        lineColor: '#000',
        labelColor: '#555',
        axisLabelOffset: {fromEnd: 40 ,fromAxis: 15},
        dataLabelOffset: 15,
        lastTickOffset: 20,
        maxTicks: 10
     } , 
   
    yAxis: {
        begin: 350,
        end: 50,
        label: 'Amount',
        font: 'bold 9px tahoma',
        lineColor: '#000',
        labelColor: '#000',
        axisLabelOffset: {fromEnd: 5 ,fromAxis: 10},
        dataLabelOffset: 15,
        lastTickOffset: 20,
        maxTicks: 10
    },
    
    legend: {
        left: 100,
        top: 50,
        textTopPadding: 16,
        font: '12px tahoma',
        textColor: '#333',
       
        caption:{
          color: '#777',
          font: 'bold 12px tahoma',
          label: 'Legend'
        },

        box: {
            height: 20,
            width: 20,
            verticalMargin: 24,
            textLeftMarin: 25
        }
    },
    
    title: {
        label: 'Stacked Column Chart',
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
 
drawStackedBarChart(barOptions);