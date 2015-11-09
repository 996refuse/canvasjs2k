function onFile(files) {

  var idAlloc = idAllocf();
  for (var i = 0, f; f = files[i]; i++) {
    console.log(f.name, f.type, f.size);

    var reader = new FileReader();
    reader.onload = function(e) {
      // get file content
      var text = e.target.result;
      var lines = text.split('\n');

      var arr = [];
      for(line in lines) {
        if (lines[line][0] == '#')
          continue;
        words = lines[line].split(',');
        divid = words[5].split('-');
        arr.push({
            cursor: "pointer",
            x: idAlloc.alloc(words[6]), 
            label: words[6], 
            y: [
              val2pos(parseInt(divid[0])), 
              val2pos(parseInt(divid[1]))
            ], 
            w4: words[4],
            w7: words[7],
            //color: class2color[words[7]],  
            toolTipContent: words[3] + '\n' + words[4] + '\n' + '(' + divid[0] + '-' + divid[1] + ')',


            //indexLabel: words[4],
            //indexLabelOrientation: "vertical",
            //indexLabelMaxWidth: 50,
            indexLabelWrap: true,
            indexLabelPlacement: "outside",
            //indexLabel: "{y[#index]}", 
            indexLabelFormatter: function ( e ) {
            	if(this.y[0] > val2pos(glbl.maximum) || this.y[1] < val2pos(glbl.minimum))
            		return "";
            	//console.log(e)
            	if(e.index == 0)
            		return e.dataPoint.w4;  
            	else
	               return "";
         	}

          });
      };
      

      grp = {}
      for(var i in arr) {
      	if(arr[i].w7 in grp)
     		grp[arr[i].w7].push(arr[i]);
      	else {
      		grp[arr[i].w7] = [];
      		grp[arr[i].w7].push(arr[i]);
      	}
      }

      data = []
      for(var i in grp)
      	data.push({
      	showInLegend: true,
      	legendText: i,

        type: "rangeBar",
        yValueFormatString: "",
        //indexLabel: "{y[#label]}",
        indexLabelFontSize: 12,
        dataPoints: grp[i]
      	})

      glbl.arr = data;
      



      sum = idAlloc.sum();

      glbl.stripLines = []
      for(i=0.5; i<sum; i++){
      	glbl.stripLines.push({
		    color:"#d8d8f8",
        value: i,
        lineDashType: "dot"
      	})
      }
      drawnow1();
    }
    reader.readAsText(f);
  }
}
var glbl = {};
glbl.maximum = Infinity;
glbl.minimum = -1;
var dropZone = document.getElementById('drop_zone');
dropZone.addEventListener('dragover', handleDragOver, false);
dropZone.addEventListener('drop', handleFileSelect, false); 
console.log("长春新时代电子科技有限公司，精益求精 永不满足");

//window.onload = function () {
var drawnow = function (minimum, maximum) {
	//console.log(glbl.arr);
/*	var newArr = jQuery.extend(true, {}, glbl.arr);
	for(var i in newArr) {
		for(var j in newArr[i]['dataPoints']){
			if (newArr[i]['dataPoints'][j]['y'][0] > maximum || newArr[i]['dataPoints'][j]['y'][1] < minimum)
				newArr[i]['dataPoints'][j]['w4'] = '';
		}
	}*/
  var chart = new CanvasJS.Chart("chartContainer",
  {
  	//width: w,
  	//height: 900,
    //zoomEnabled: true,
    title: {
      text: "设备频率划分图"
    },
    theme:"theme1",
    animationEnabled:true,
    //exportEnabled: true,
    axisY: {
    	minimum: val2pos(minimum),
    	maximum: val2pos(maximum),

      interval: 1,
      includeZero: false,
      labelFormatter: function ( e ) {
        return pos2val(e.value);  
        //return e.value;
     }
    },
    axisX: {
      interval: 1,
      stripLines: glbl.stripLines
    },
    toolTip: {
      content: "{label} </br> 最小: {y[0]}, 最大: {y[1]}"
    },

    legend:{
    	horizontalAlign: "right",
    	verticalAlign: "bottom"
    },
    data: glbl.arr
  });

  chart.render();
}

var drawnow1 = function () {
	//console.log(glbl.arr);
/*	var newArr = jQuery.extend(true, {}, glbl.arr);
	for(var i in newArr) {
		for(var j in newArr[i]['dataPoints']){
			if (newArr[i]['dataPoints'][j]['y'][0] > maximum || newArr[i]['dataPoints'][j]['y'][1] < minimum)
				newArr[i]['dataPoints'][j]['w4'] = '';
		}
	}*/
  var chart = new CanvasJS.Chart("chartContainer",
  {
  	//width: w,
  	//height: 900,
    //zoomEnabled: true,
    title: {
      text: "设备频率划分图"
    },
    theme:"theme1",
    animationEnabled:true,
    //exportEnabled: true,
    axisY: {
      interval: 1,
      includeZero: false,
      labelFormatter: function ( e ) {
        return pos2val(e.value);  
        //return e.value;
     }
    },
    axisX: {
      interval: 1,
      stripLines: glbl.stripLines
    },
    toolTip: {
      content: "{label} </br> 最小: {y[0]}, 最大: {y[1]}"
    },

    legend:{
    	horizontalAlign: "right",
    	verticalAlign: "bottom"
    },

/*
    data: [
      {
      	showInLegend: true,

        type: "rangeBar",
        yValueFormatString: "",
        //indexLabel: "{y[#label]}",
        indexLabelFontSize: 12,
        dataPoints: arr
      }
    ]
*/	data: glbl.arr
  });
  chart.render();
}
/*
function chx () {
	w = $( "#defaultSlider" ).val() ;
	//console.log(   );
	drawnow(w);
}*/

$(document).ready(function(){
	$("input").change(function(){
		i = parseFloat($( "#minx" ).val() );
		a = parseFloat($( "#maxx" ).val() );
		//console.log(i);
		//console.log(a);
		glbl.maximum = a;
		glbl.minimum = i;
    drawnow(i , a);
	});
});

