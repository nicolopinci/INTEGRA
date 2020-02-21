function getCurrentWorkspace() {
  let tab;
  
  zIndexMax = Number.NEGATIVE_INFINITY;
  tab = document.getElementsByClassName("container")[0];
  
  let existingTabs = document.getElementsByClassName("container"); // all the tabs currently opened
  
  for(let t=0; t<existingTabs.length; ++t) { // for each tab
    console.log(existingTabs[t]);
    console.log(parseInt(existingTabs[t].parentNode.style.zIndex));
    
    if(parseInt(existingTabs[t].parentNode.style.zIndex) > zIndexMax && existingTabs[t].style.display != 'none') { // the workspace is the one of interest
      tab = existingTabs[t]; // remember the ID of that workspace
      zIndexMax = parseInt(existingTabs[t].parentNode.style.zIndex);
    }
  }
  
  return tab;
}


function getCurrentModal() {

  let allModals = document.querySelectorAll(".modal");
  for(let i=0; i<allModals.length; ++i) {
    if(allModals[i].style.display == "inline-block") {
      return allModals[i];
    }
  }
}

function getModalFromPlus(plusSign) {

  tabNum = plusSign.id.split("_ctab")[1];
  return document.querySelector(" #myModal" + tabNum);

}


function addCustomGraph(evt) {

  getModalFromPlus(this).style.display = "inline-block";
  getModalFromPlus(this).querySelector(" .close").addEventListener("click", closeModal, false);
  getModalFromPlus(this).querySelector(" .plotHeat").addEventListener("click", plotNewCustomHeat, false);
  getModalFromPlus(this).querySelector(" .plotHeatStatic").addEventListener("click", plotNewCustomStaticHeat, false);
  getModalFromPlus(this).querySelector(" .plotScatter2d").addEventListener("click", plotNewCustomScatter2D, false);
  getModalFromPlus(this).querySelector(" .plotScatter3d").addEventListener("click", plotNewCustomScatter3D, false);
  getModalFromPlus(this).querySelector(" .plotBox").addEventListener("click", plotNewCustomBox, false);
  getModalFromPlus(this).querySelector(" .exportJS").addEventListener("click", exportCode, false);
  
  let currentModal = getCurrentModal();
  let currentWorkspaceID = "ctab" + currentModal.id.split("Modal")[1];
  
  let fileName = wsChosenDS[currentWorkspaceID.split("tab")[1]];
  
  if(fileName.split(".")[1] == "2d") {
    getModalFromPlus(this).querySelector(" .showDS").href = "https://github.com/nicolopinci/INTEGRA/wiki/Soccer-dataset-structure";
  }
}



function drawPresetGraphs(graphType, parsedData, containerID) {
  switch(graphType) {
    case "2d":

      
      // Graph with players
    let newGraphBoxNG = createNewGraphBox("2d", containerID, "NG");
      newGraphBoxNG.style.height = "430px";
      newGraphBoxNG.style.width = "690px";
      newGraphBoxNG.style.padding = "4px";
      plotNetwork(newGraphBoxNG.id, parsedData,0);

	  // Graph with players (animated)
    let newGraphBoxNGA = createNewGraphBox("2d", containerID, "NGA");
      newGraphBoxNGA.style.height = "430px";
      newGraphBoxNGA.style.width = "690px";
      newGraphBoxNGA.style.padding = "4px";
      let canvasAnimated = document.createElement('canvas');
      
      canvasAnimated.height = "423";
      canvasAnimated.width = "683";
      newGraphBoxNGA.appendChild(canvasAnimated);
      plotAnimatedNetwork(newGraphBoxNGA.id, parsedData, 1, 100, 50); 

      // Eccentricity GVR
      let newGraphBoxEcc = createNewGraphBox("2d", containerID, "ECC");
      plotHeat(calculateGlobalEccAll(parsedData),'heatmap', newGraphBoxEcc.id, "Eccentricity GVR", "Time", "Player");

      // Eccentricity Sorted GVR
      let newGraphBoxEccS = createNewGraphBox("2d", containerID, "ECCS");
      plotHeat(sortEccAll(calculateGlobalEccAll(parsedData)),"heatmap", newGraphBoxEccS.id, "Eccentricity GVR (Sorted)", "Time", "Player");

      // Average Eccentricity GVR
      let newGraphBoxAEcc = createNewGraphBox("2d", containerID, "AECC");
      plotHeat(arrayAverage(calculateGlobalEccAll(parsedData)),'heatmap', newGraphBoxAEcc.id, "Average Eccentricity GVR", "Player", "");

      // Normal heat map
      let newGraphBoxNH = createNewGraphBox("2d", containerID, "NH");
      plotHeat(computeHeatMatrix(parsedData, 101, 61),'heatmap', newGraphBoxNH.id, "Heat map", "Width", "Length");

      // Radix heat map
      let newGraphBoxRH = createNewGraphBox("2d", containerID, "RH");
      plotHeat(computeRadixHeat(computeHeatMatrix(parsedData, 101, 61)),'heatmap', newGraphBoxRH.id, "Radix heat map", "Width", "Length");

      // Averaged radix heat map
      let newGraphBoxARH = createNewGraphBox("2d", containerID, "ARH");
      plotHeat(computeRadixHeat(computeAverageHeatMatrix(parsedData, 101, 61)),'heatmap', newGraphBoxARH.id, "Averaged radix heat map", "Width");

      // Radix 3D heat map
      let newGraphBox3RH = createNewGraphBox("2d", containerID, "3RH");
      plotHeat(computeRadixHeat(computeHeatMatrix(parsedData, 101, 61)),'surface', newGraphBox3RH.id, "Radix tridimensional heat map", "Width", "Length");

    break;

    case "sn":
      let newGraphBoxSN = createNewGraphBox("sn", containerID, "SN");
      plotScatter(parsedData,'scatter3d', newGraphBoxSN.id, "Tridimensional relational point graph", "Width", "Length");

      let newGraphBoxSNAD1 = createNewGraphBox("sn", containerID, "SNAD");
      plotHeat(calcTotAmmDegree(parsedData, 1),'heatmap', newGraphBoxSNAD1.id, "Amortized degree GVR (k=1)", "Timestamp", "User");

      let newGraphBoxSNADPEAKS1 = createNewGraphBox("sn", containerID, "SNADPEAKS");
      plotHeat(groupMatrix(calculateActivityPeaks((calcTotAmmDegree(parsedData, 1))), 1000),'heatmap', newGraphBoxSNADPEAKS1.id, "Grouped activity peaks GVR (r=1000)", "Block", "User");

      let newGraphBoxSNAD0995 = createNewGraphBox("sn", containerID, "SNAD0995");
      plotHeat(calcTotAmmDegree(parsedData, 0.995),'heatmap', newGraphBoxSNAD0995.id, "Amortized degree GVR (k=0.995)", "Timestamp", "User");

      let newGraphBoxSNAD09995 = createNewGraphBox("sn", containerID, "SNAD09995");
      plotHeat(calcTotAmmDegree(parsedData, 0.9995),'heatmap', newGraphBoxSNAD09995.id, "Amortized degree GVR (k=0.9995)", "Timestamp", "User");

      let newGraphBoxInitiative = createNewGraphBox("sn", containerID, "SNINI");
      plotHeat(calcTotInitiative(parsedData),'heatmap', newGraphBoxInitiative.id, "Initiative GVR", "Timestamp", "User");

      let newGraphBoxLocClust = createNewGraphBox("sn", containerID, "SNLC");
      plotHeat(calculateLocalClusteringThroughTime(parsedData),'heatmap', newGraphBoxLocClust.id, "Local Clustering GVR", "User", "Timestamp");

    break;
  }

}

function plotData(xdata, ydata, typedata, elementID, myTitle, xaxis, yaxis) {

  let data = [
    {
    "x": xdata,
    "y": ydata,
    "type": typedata
  }
];

let layout = defineLayout(myTitle, xaxis, yaxis);

Plotly.newPlot(elementID, data, layout, {showSendToCloud: true});

}

function plotHeat(zdata, typedata, elementID, myTitle, xaxis, yaxis) {
  var data = [
    {
    "z": zdata,
    "type": typedata,
    "colorscale":[["0.000000000000", "rgb(62,38,168)"],['0.015873015873', 'rgb(64,42,180)'],['0.031746031746', 'rgb(66,46,192)'],['0.047619047619', 'rgb(68,50,203)'],['0.063492063492', 'rgb(69,55,213)'],['0.079365079365', 'rgb(70,60,222)'],['0.095238095238', 'rgb(71,65,229)'],['0.111111111111', 'rgb(71,71,235)'],['0.126984126984', 'rgb(72,77,240)'],['0.142857142857', 'rgb(72,82,244)'],['0.158730158730', 'rgb(71,88,248)'],['0.174603174603', 'rgb(70,94,251)'],['0.190476190476', 'rgb(69,99,253)'],['0.206349206349', 'rgb(66,105,254)'],['0.222222222222', 'rgb(62,111,255)'],['0.238095238095', 'rgb(56,117,254)'],['0.253968253968', 'rgb(50,124,252)'],['0.269841269841', 'rgb(47,129,250)'],['0.285714285714', 'rgb(46,135,247)'],['0.301587301587', 'rgb(45,140,243)'],['0.317460317460', 'rgb(43,145,239)'],['0.333333333333', 'rgb(39,151,235)'],['0.349206349206', 'rgb(37,155,232)'],['0.365079365079', 'rgb(35,160,229)'],['0.380952380952', 'rgb(32,165,227)'],['0.396825396825', 'rgb(28,169,223)'],['0.412698412698', 'rgb(24,173,219)'],['0.428571428571', 'rgb(18,177,214)'],['0.444444444444', 'rgb(8,181,208)'],['0.460317460317', 'rgb(1,184,202)'],['0.476190476190', 'rgb(2,186,195)'],['0.492063492063', 'rgb(11,189,189)'],['0.507936507937', 'rgb(25,191,182)'],['0.523809523810', 'rgb(36,193,174)'],['0.539682539683', 'rgb(44,196,167)'],['0.555555555556', 'rgb(49,198,159)'],['0.571428571429', 'rgb(55,200,151)'],['0.587301587302', 'rgb(63,202,142)'],['0.603174603175', 'rgb(74,203,132)'],['0.619047619048', 'rgb(87,204,122)'],['0.634920634921', 'rgb(100,205,111)'],['0.650793650794', 'rgb(114,205,100)'],['0.666666666667', 'rgb(129,204,89)'],['0.682539682540', 'rgb(143,203,78)'],['0.698412698413', 'rgb(157,201,67)'],['0.714285714286', 'rgb(171,199,57)'],['0.730158730159', 'rgb(185,196,49)'],['0.746031746032', 'rgb(197,194,42)'],['0.761904761905', 'rgb(209,191,39)'],['0.777777777778', 'rgb(220,189,41)'],['0.793650793651', 'rgb(230,187,45)'],['0.809523809524', 'rgb(240,186,54)'],['0.825396825397', 'rgb(248,186,61)'],['0.841269841270', 'rgb(254,190,60)'],['0.857142857143', 'rgb(254,195,56)'],['0.873015873016', 'rgb(254,201,52)'],['0.888888888889', 'rgb(252,207,48)'],['0.904761904762', 'rgb(250,214,45)'],['0.920634920635', 'rgb(247,220,42)'],['0.936507936508', 'rgb(245,227,39)'],['0.952380952381', 'rgb(245,233,36)'],['0.968253968254', 'rgb(246,239,32)'],['0.984126984127', 'rgb(247,245,27)'],
    ['1.000000000000', 'rgb(249,251,21)']]

  }
];

let layout = defineLayout(myTitle, xaxis, yaxis);
Plotly.newPlot(elementID, data, layout, {showSendToCloud: true});

}

function plotScatter(dataArray, typedata, elementID, myTitle, xaxis, yaxis) {

  function extractData(key, da) {
    let dataMap = {};
    dataMap["A"] = [];
    dataMap["B"] = [];
    dataMap["ts"] = [];


    for(let i=0; i<da.length; ++i) {
      dataMap[key].push(da[i][key]);
    }
    return dataMap[key];
  }

  let data = [
    {
    "x": extractData("A", dataArray),
    "y": extractData("B", dataArray),
    "z": extractData("ts", dataArray),
    "mode": "markers",
    "type": typedata,
    marker: {
		color: 'rgb(51, 161, 220)',
		size: 1,
		symbol: 'circle',
		opacity: 0.45},

  }
];


let layout = {
  scene: {
		xaxis:{title: 'Sender'},
		yaxis:{title: 'Recipient'},
		zaxis:{title: 'Time'},
		},

	margin: {
	 l: 0,
	 r: 0,
	 b: 0,
	 t: 0,
	 pad: 4
	},
}

Plotly.newPlot(elementID, data, layout, {showSendToCloud: true});
}

function defineLayout(myTitle, xaxis, yaxis) {
  let layout = {

  "title": {
    "text": myTitle
  },
  "xaxis": {
    "title": {
      "text": xaxis
    },
  },
  "yaxis": {
    "title": {
      "text": yaxis
    }
  }
};

return layout;
}


function plotAnimatedNetwork(elementID, dataset, startFrame, endFrame, interval) {
  
    if(startFrame < endFrame) {
      let canvas = document.getElementById(elementID).querySelector("canvas");
      let ctx = canvas.getContext('2d');
      ctx.lineWidth = 1;

	    var c = computeNetwork(elementID, dataset, startFrame);   
	    image = Canvas2Image.convertToPNG(c, canvas.width, canvas.height);
      
      canvas.style.background = "url("+image.src+")";
      
      setTimeout(plotAnimatedNetwork.bind(null, elementID, dataset, startFrame + 1, endFrame, interval), interval);
    }
 
}



function plotNetwork(elementID, dataSet,frame){
	let canvas = computeNetwork(elementID, dataSet, frame);
	 document.getElementById(elementID).appendChild(canvas);
}


  
function computeNetwork(elementID, dataSet,frame){
 var teamOne = [], teamTwo = [];
 for (i = 0; i<=10; i++){
   teamOne.push([dataSet[frame][0][i][0],dataSet[frame][0][i][1]])
   teamTwo.push([dataSet[frame][1][i][0],dataSet[frame][1][i][1]])
 }

 var delaunay1 = new Delaunay(teamOne);
 var delaunay2 = new Delaunay(teamTwo);
 var triangles1 = delaunay1.triangulate();
 var triangles2 = delaunay2.triangulate();
 var canvas = document.createElement('canvas');
 var ctx = canvas.getContext('2d');
 ctx.lineWidth = 1;

canvas.height = "423";
canvas.width = "683";

// Draw football field
  var pitch = {
    draw : function () {

      // Outer lines
      ctx.beginPath();
      ctx.rect(0,0, canvas.width, canvas.height);
      ctx.fillStyle = "#A9DB9D";
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "#FFF";
      ctx.stroke();
      ctx.closePath();

      ctx.fillStyle = "#FFF";

      // Mid line
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.stroke();
      ctx.closePath();

      //Mid circle
      ctx.beginPath()
      ctx.arc(canvas.width / 2, canvas.height / 2, 73, 0, 2*Math.PI, false);
      ctx.stroke();
      ctx.closePath();
      //Mid point
      ctx.beginPath()
      ctx.arc(canvas.width / 2, canvas.height / 2, 2, 0, 2*Math.PI, false);
      ctx.fill();
      ctx.closePath();

      //Home penalty box
      ctx.beginPath();
      ctx.rect(0, (canvas.height - 322) / 2, 132, 322);
      ctx.stroke();
      ctx.closePath();
      //Home goal box
      ctx.beginPath();
      ctx.rect(0, (canvas.height - 146) / 2, 44, 146);
      ctx.stroke();
      ctx.closePath();
      //Home goal
      ctx.beginPath();
      ctx.moveTo(1, (canvas.height / 2) - 22);
      ctx.lineTo(1, (canvas.height / 2) + 22);
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.closePath();
      ctx.lineWidth = 1;

      //Home penalty point
      ctx.beginPath()
      ctx.arc(88, canvas.height / 2, 1, 0, 2*Math.PI, true);
      ctx.fill();
      ctx.closePath();
      //Home half circle
      ctx.beginPath()
      ctx.arc(88, canvas.height / 2, 73, 0.29*Math.PI, 1.71*Math.PI, true);
      ctx.stroke();
      ctx.closePath();

      //Away penalty box
      ctx.beginPath();
      ctx.rect(canvas.width-132, (canvas.height - 322) / 2, 132, 322);
      ctx.stroke();
      ctx.closePath();
      //Away goal box
      ctx.beginPath();
      ctx.rect(canvas.width-44, (canvas.height - 146) / 2, 44, 146);
      ctx.stroke();
      ctx.closePath();
      //Away goal
      ctx.beginPath();
      ctx.moveTo(canvas.width-1, (canvas.height / 2) - 22);
      ctx.lineTo(canvas.width-1, (canvas.height / 2) + 22);
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.closePath();
      ctx.lineWidth = 1;
      //Away penalty point
      ctx.beginPath()
      ctx.arc(canvas.width-88, canvas.height / 2, 1, 0, 2*Math.PI, true);
      ctx.fill();
      ctx.closePath();
      //Away half circle
      ctx.beginPath()
      ctx.arc(canvas.width-88, canvas.height / 2, 73, 0.71*Math.PI, 1.29*Math.PI, false);
      ctx.stroke();
      ctx.closePath();

      //Home L corner
      ctx.beginPath()
      ctx.arc(0, 0, 8, 0, 0.5*Math.PI, false);
      ctx.stroke();
      ctx.closePath();
      //Home R corner
      ctx.beginPath()
      ctx.arc(0, canvas.height, 8, 0, 2*Math.PI, true);
      ctx.stroke();
      ctx.closePath();
      //Away R corner
      ctx.beginPath()
      ctx.arc(canvas.width, 0, 8, 0.5*Math.PI, 1*Math.PI, false);
      ctx.stroke();
      ctx.closePath();
      //Away L corner
      ctx.beginPath()
      ctx.arc(canvas.width, canvas.height, 8, 1*Math.PI, 1.5*Math.PI, false);
      ctx.stroke();
      ctx.closePath();
    }
  };

pitch.draw();


 ctx.linewidth = 1;
 let f=6.5;
 for(x = 0; x < triangles1.length-3; x = x +3){
   ctx.strokeStyle = 'blue';
   ctx.beginPath();
   ctx.moveTo(triangles1[x][0]*f,triangles1[x][1]*f);
   ctx.lineTo(triangles1[x+1][0]*f,triangles1[x+1][1]*f);
   ctx.lineTo(triangles1[x+2][0]*f,triangles1[x+2][1]*f);
   ctx.lineTo(triangles1[x][0]*f,triangles1[x][1]*f);
   ctx.closePath();
   ctx.stroke();
   //console.log(x);
 }
 for(x = 0; x < triangles2.length-3; x = x +3){
   ctx.strokeStyle = 'red';
   ctx.beginPath();
   ctx.moveTo(triangles2[x][0]*f,triangles2[x][1]*f);
   ctx.lineTo(triangles2[x+1][0]*f,triangles2[x+1][1]*f);
   ctx.lineTo(triangles2[x+2][0]*f,triangles2[x+2][1]*f);
   ctx.lineTo(triangles2[x][0]*f,triangles2[x][1]*f);
   ctx.closePath();
   ctx.stroke();
 }

 for(x = 0; x < teamOne.length; ++x) {
	  ctx.beginPath();
 ctx.arc(teamOne[x][0]*f, teamOne[x][1]*f, 10, 0, 2 * Math.PI, false);
      ctx.fillStyle = 'white';
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'blue';
      ctx.stroke();


 }

  for(x = 0; x < teamOne.length; ++x) {
	  ctx.beginPath();

      ctx.fillStyle = 'black';

	ctx.font = "10px Arial";
	ctx.fillText(x+1, teamOne[x][0]*f-4, teamOne[x][1]*f+4);
	  ctx.stroke();

 }

  for(x = 0; x < teamTwo.length; ++x) {
	  ctx.beginPath();
 ctx.arc(teamTwo[x][0]*f, teamTwo[x][1]*f, 10, 0, 2 * Math.PI, false);
      ctx.fillStyle = 'white';
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'red';
      ctx.stroke();


 }

  for(x = 0; x < teamTwo.length; ++x) {
	  ctx.beginPath();
      ctx.fillStyle = 'black';

	ctx.font = "10px Arial";
	ctx.fillText(x+1, teamTwo[x][0]*f-4, teamTwo[x][1]*f+4);
	  ctx.stroke();

 }

return canvas;

}


function plotCustomScatter(inData, elementID, type, myTitle) {
  
  Plotly.newPlot(elementID, inData[0], {title: myTitle, showSendToCloud: true});

  Plotly.plot(elementID, inData).then(function () {
    let j=0;
    for(j=0; j<inData.length; ++j) {
      let xValues = [];
      let yValues = [];
      let zValues = [];
      for(let i=0; i<inData[j].length; ++i) {
        xValues.push(inData[j][i][0]);
        yValues.push(inData[j][i][1]);
        zValues.push(inData[j][i][2]);
      }
   
      let myData = [{x: xValues, y: yValues, z: zValues, type: type}];
 
      Plotly.addFrames(elementID, [
        {
          data: myData,
          name: 'frame'+j
        }
      ]);
      
    }
      startAnimation(j);
    })

  function startAnimation(j) {
    let anArray = [];
    for(let i=0; i<j; ++i) {
      anArray.push('frame'+i);
    }
    Plotly.animate(elementID, anArray, {
      frame: [
        {duration: 1000},
        {duration: 1000},
      ],
      transition: [
        {duration: 0},
        {duration: 0},
      ],
      mode: 'afterall'
    })
  }


}


function plotCustomHeat(inData, elementID, myTitle) {
  Plotly.newPlot(elementID, inData[0], {title: myTitle, showSendToCloud: true});

  Plotly.plot(elementID, inData).then(function () {
    let i=0;
    for(i=0; i<inData.length; ++i) {
    Plotly.addFrames(elementID, [
      {
        data: [{z: inData[i], type: 'heatmap'}],
        name: 'frame'+i
      }
    ]);
  }
      startAnimation(i);
     
  })

  function startAnimation(j) {
    let anArray = [];
    for(let i=0; i<j; ++i) {
      anArray.push('frame'+i);
    }
    Plotly.animate(elementID, anArray, {
      frame: [
        {duration: 1000},
        {duration: 1000},
      ],
      transition: [
        {duration: 0},
        {duration: 0},
      ],
      mode: 'afterall'
    })
  }
}


function plotCustomBox(inData, elementID, myTitle)  {
 
  let traces = [];
  
  for (let i=0; i < inData[0].length; ++i) {
	  traces.push({y: inData[0][i], type: "box", name: i+1});
  }

  console.log(traces);
  
  let layout = defineLayout(myTitle, '', '');
  Plotly.newPlot(elementID, traces, layout, {showSendToCloud: true});
}


function prepareCustomPlot(eventPossibility) {

  let currentModal = getCurrentModal();
  let currentWorkspaceID = "ctab" + currentModal.id.split("Modal")[1];
  
  let fileName = wsChosenDS[currentWorkspaceID.split("tab")[1]];
  let inData = [];
  if(fileName.split(".")[1]==="2d") {
    inData = getAllPlayersXYAllFrames(fileMap[fileName]);
  }
  else if(fileName.split(".")[1]==="sn"){
    inData = parseSN(fileMap[fileName]);
  }
  
  eval("function defineCustomCode(inData) {" + currentModal.querySelector(".JSCode").value + " return outData;}");
  let graphData = defineCustomCode(inData);
  let countGraphs = document.querySelector("#" + currentWorkspaceID + " .graphs ul").childElementCount;
  let graphTitle = currentModal.querySelector(" .graphTitle").value;
  let graphIdentifier = "custom"+countGraphs;
  
  if(eventPossibility) {
     let visualizeEvents = currentModal.querySelector(" .selectVis").value;    
     graphIdentifier += "+" + visualizeEvents;
  }
  
  let newCustomGraphBox = createNewGraphBox("2d", currentWorkspaceID, graphIdentifier);
  return {data: graphData, graphBoxId: newCustomGraphBox.id, title: graphTitle};
}


function plotNewCustomHeat(evt) {
  let info = prepareCustomPlot(false);
  plotCustomHeat(info.data, info.graphBoxId, info.title);
}


function plotNewCustomStaticHeat(evt) {
  let info = prepareCustomPlot(true);
  plotHeat(info.data[0], 'heatmap', info.graphBoxId, info.title, '', '');
}


function plotNewCustomScatter2D(evt) {
  let info = prepareCustomPlot(true);
  plotCustomScatter(info.data, info.graphBoxId, 'scatter', info.title);
}


function plotNewCustomScatter3D(evt) {
  let info = prepareCustomPlot(true);
  plotCustomScatter(info.data, info.graphBoxId, 'scatter3d', info.title);
}


function plotNewCustomBox(evt) {
  let info = prepareCustomPlot(false);
  plotCustomBox(info.data, info.graphBoxId, info.title);
}
