function onFile(files) {
  var idAlloc = idAllocf();
  for (var i = 0, f; f = files[i]; i++) {
    //console.log(f.name, f.type, f.size);
    var reader = new FileReader();
    reader.onload = function(e) {
      // get file content
      var text = e.target.result;
      var lines = text.split('\n');
      var arr = [];
      for(var line in lines) {
        if (lines[line][0] == '#')
          continue;
        words = lines[line].split(',');
        divid = words[5].split('-');
        arr.push([
          words[0], //0序号
          words[1], //1平台类型     
          words[2], //2平台名称   
          words[3], //3装备型号
          words[4], //4装备名称
          //words[5],
          idAlloc.alloc(words[6]), //*** 5 ***分配id
          words[6], //6隶属单位
          words[7], //7类别属性

          parseFloat(divid[0]), //8下界
          parseFloat(divid[1]) //9上界
        ]);
      };
      onDataLoad(arr, idAlloc.sum());
    }
    reader.readAsText(f);
  }
}

var glbl = {};
glbl.linesPerPage = 6;
glbl.stripLines = []
for(i=0.5; i<=glbl.linesPerPage; i++){
  glbl.stripLines.push({
  color:"#d8d8f8",
  value: i,
  lineDashType: "dot"
  })
}

//产生全局arr
//产生全局pgs
function onDataLoad(arr, s) {
  var pages = parseInt(s/glbl.linesPerPage);
  for (var i = 0; i <= pages; i++) {
    $item = $('<li><a href="#" onClick="onDrawTable('+i.toString()+');">'+(i+1).toString()+'</a></li>');
    $('#pg').append($item)
  };


  glbl.arr = arr;
  glbl.sum = s;
  glbl.pgs = {};

  for (var i in glbl.arr) {
    key = parseInt(glbl.arr[i][5]/glbl.linesPerPage);

    if (glbl.pgs.hasOwnProperty(key)) {
      glbl.pgs[key].push(glbl.arr[i]);
    } else {
      glbl.pgs[key] = [];
      glbl.pgs[key].push(glbl.arr[i]);
    };
  };
  onDrawTable(0);
}

//产生全局data
function onDrawTable(pageNum) {
  var data = glbl.pgs[pageNum];

  var minimum = Infinity;
  var maximum = 0;
  for (var i in data) {
    l = parseFloat(data[i][8]);
    h = parseFloat(data[i][9]);
    if(l < minimum)
      minimum = l;
    if(h > maximum)
      maximum = h;
  };
  minimum = pos2val(parseInt(val2pos(minimum)) - 1);
  maximum = pos2val(parseInt(val2pos(maximum)) + 1);
  $('#minx').attr('value', minimum);
  $('#maxx').attr('value', maximum);

  var LocalArr = [];
  for (var i in data) {
    LocalArr.push({
            cursor: "pointer",
            x: data[i][5], 
            label: data[i][6], 
            y: [
              val2pos(data[i][8]), 
              val2pos(data[i][9])
            ], 
            w4: data[i][4],
            w7: data[i][7],
            toolTipContent: data[i][3] + '\n' + data[i][4] + '\n' + '(' + data[i][8] + '-' + data[i][9] + ')',

            indexLabelWrap: true,
            indexLabelPlacement: "outside",
            indexLabelFormatter: function ( e ) {
              if(this.y[0] > patchh || this.y[1] < patchl) {
                return "";
              }
              if(e.index == 0)
                return e.dataPoint.w4;  
              else
                 return "";
            }
    });
  };

  var grp = {}
  for(var i in LocalArr) {
    if(LocalArr[i].w7 in grp)
    grp[LocalArr[i].w7].push(LocalArr[i]);
    else {
      grp[LocalArr[i].w7] = [];
      grp[LocalArr[i].w7].push(LocalArr[i]);
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

  glbl.data = data;
  drawnow(minimum, maximum);
}

var drawnow = function (mini, maxi) {
  patchl = val2pos(mini)
  patchh = val2pos(maxi);

  var chart = new CanvasJS.Chart("chartContainer",
  {
    title: {
      text: "设备频率划分图"
    },
    theme:"theme1",
    animationEnabled:true,
    exportEnabled: true,
    axisY: {
    	minimum: patchl,
    	maximum: patchh,

      interval: 1,
      includeZero: false,
      labelFormatter: function ( e ) {
        return pos2val(e.value);  
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
    data: glbl.data
  });

  chart.render();
}

var patchl = 0;
var patchh = Infinity;
$(document).ready(function(){
	$("input").change(function(){
		i = parseFloat($( "#minx" ).val() );
		a = parseFloat($( "#maxx" ).val() );
    drawnow(i , a);
	});
});
