//Written by Tadesse D. Feyissa. May 17, 2013.

var canvas = $('#canvas1');
var cv = canvas[0];
var th;
      
var pieOptions = {
           
    canvas: cv,
    
    center: {x: 300, y: 200},
    radius: 150,
    
    graph: {
      font: 'bold 11px tahoma',
      textAlign: 'center',
      strokeStyle: '#FFF',
    },
     
    dataSeries: [{value: 17.5, legend: 'Salt',color: "#7E3817"}, {value: 15, legend: 'Soil',color: "#3E3817"}, {value: 35, legend: 'Grass',color: "#00A300"}, 
                        {value: 12.5, legend: 'Water',color: "#0000F0"}, {value: 20, legend: 'Sunlight',color: "#00ACF0"}],
             
    title: {
        label: 'Pie chart',
        position : {x:10, y:15},
        font: 'bold 18px sans-serif',
        color: '#336699'
    },
    
    events: {
        click: function(e){
                  var info = $('#graphInfo');
                  $('#content', info).html(JSON.stringify(e.data.arc.data));
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
                  $('#content', info).html(JSON.stringify(e.data.arc.data));
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
 
 drawPieChart(pieOptions);