document.getElementById("addW").addEventListener("click", addTab, false);
document.addEventListener("DOMContentLoaded", createFirstWS, false);

function addTab() {
  var workspaceTab = createTabElement();
  var newContainer = createContainerElement();
  addEventHandlers(newContainer);
  addTabHandlers(workspaceTab);
  handleWorkspaceStatus(newContainer);
}

function handleWorkspaceStatus(newContainer) {

  let wsMap = {};

  // Add element to the workspace-event list
  eventWsList.push(wsMap);

  // Handle the workspace status
  wsChosenDS.push("");
  document.querySelectorAll("#" + newContainer.id + " .datasetList")[0].addEventListener("change", chooseDataset, false);

  wsChosenFramerate.push("");
  document.querySelectorAll("#" + newContainer.id + " .framerate")[0].addEventListener("change", chooseFramerate, false);

  wsChosenStartFrame.push("");
  document.querySelectorAll("#" + newContainer.id + " .startFrame")[0].addEventListener("change", chooseSF, false);
  document.querySelectorAll("#" + newContainer.id + " .frameStartS")[0].addEventListener("change", chooseSF, false);

  wsChosenEndFrame.push("");
  document.querySelectorAll("#" + newContainer.id + " .endFrame")[0].addEventListener("change", chooseEF, false);
  document.querySelectorAll("#" + newContainer.id + " .frameEndS")[0].addEventListener("change", chooseEF, false);
}

function createTabElement() {
  var workspaceTab = document.createElement("li");
  workspaceTab.style.zIndex=document.getElementsByClassName("tabsGroup")[0].children[0].childElementCount*(-1)-100;
  workspaceTab.appendChild(document.createTextNode("Workspace "+document.getElementsByClassName("tabsGroup")[0].children[0].childElementCount));
  workspaceTab.id = "tab"+document.getElementsByClassName("tabsGroup")[0].children[0].childElementCount;
  workspaceTab.className ="ws";
  document.getElementsByClassName("tabsGroup")[0].children[0].appendChild(workspaceTab);

  return workspaceTab;
}

function createContainerElement() {

  let container0 = document.getElementById("container");

  var newContainer = document.createElement("div");
  newContainer.innerHTML = container0.innerHTML;
  newContainer.className = "container";
  newContainer.style.display = "none";
  newContainer.id = "ctab"+(document.getElementsByClassName("tabsGroup")[0].children[0].childElementCount-1);
  body = document.getElementsByTagName("body")[0];
  body.appendChild(newContainer);

  return newContainer;
}

function addEventHandlers(newContainer) {
  document.querySelectorAll("#" + newContainer.id + " .addEvent")[0].addEventListener("click", addAnEvent, false);
  document.querySelectorAll("#" + newContainer.id + " .editEventB")[0].addEventListener("click", finalizeEditEvent, false);
}

function addTabHandlers(workspaceTab) {
  workspaceTab.addEventListener("click", openWorkspace, false); // to open the tab when clicked
  simulateClickOnTab(workspaceTab); // When a tab is created, open it
}

function simulateClickOnTab(workspaceTab) {
  // Open the tab when created
  var evObj = document.createEvent('Events');
  evObj.initEvent("click", true, false);
  workspaceTab.dispatchEvent(evObj);
}

function openWorkspace(evt) {
  for(var i=0; i<document.querySelectorAll(".container").length; ++i) {
    document.querySelectorAll(".container")[i].style.display = "none";
  }
  document.getElementById("c"+this.id).style.display = "inline-block";

  for(var i=0; i<document.querySelectorAll(".ws").length; ++i) {
    document.querySelectorAll(".ws")[i].style.backgroundColor = "white";
    document.querySelectorAll(".ws")[i].style.color = "black";

  }

  document.getElementById(this.id).style.backgroundColor = "#222222";
  document.getElementById(this.id).style.color = "white";
}

function addAnEvent(evt) {
  // Add to event the event list
  evTitle = document.querySelector("#"+this.parentNode.parentNode.parentNode.id+" .eventTitle").value;
  if(!alreadyExist(evTitle, this.parentNode.parentNode.parentNode.id)) {
    evLi = document.createElement("li");
    evLi.innerHTML = "<span class=\"editEvent\">...</span><span>"+evTitle+"</span><span class=\"deleteEvent\">X</span>";
    document.querySelector("#"+this.parentNode.parentNode.parentNode.id+" .ulEvents").appendChild(evLi);

    // Store in memory
    let eventInfo = [document.querySelector("#"+this.parentNode.parentNode.parentNode.id+" .eventTimestamp").value, document.querySelector("#"+this.parentNode.parentNode.parentNode.id+" .eventColor").value];
    eventWsList[this.parentNode.parentNode.parentNode.id.split("ctab")[1]][evTitle] = eventInfo;

	// Store as a graph variable
	let allGraphs = document.querySelectorAll("#"+this.parentNode.parentNode.parentNode.id+" .graphs li" );


	for(let elem = 0; elem < allGraphs.length; ++elem) {
		if(allGraphs[elem].firstChild.id.includes("SNAD") || allGraphs[elem].firstChild.id.includes("SNINI") ||  allGraphs[elem].firstChild.id.includes("_ECC")) {
		Plotly.addTraces(allGraphs[elem].firstChild, [{ x: [eventInfo[0]], name: evTitle}]);
		}

		/*console.log(allGraphs[elem]);
		allGraphs[elem].firstChild.data[0].evTS = [];
			allGraphs[elem].firstChild.data[0].evName = [];

		allGraphs[elem].firstChild.data[0].evTS.push(eventInfo[0]);
				allGraphs[elem].firstChild.data[0].evName.push(evTitle);
*/
	}

    // Handle editing and deletion
    evLi.children[2].addEventListener("click", deleteThisEvent, false);
    evLi.children[0].addEventListener("click", editThisEvent, false);
  }
  else {
    alert("An event with the same name has already been created in this workspace");
  }
}

function drawPresetGraphs(graphType, parsedData, containerID) {
  switch(graphType) {
    case "2d":

      /* 4 var graphs
      let newGraphBoxEcc = createNewGraphBox("2d", containerID, "ECC");
      plotCustomHeat([[[1, 2]], [[1, 2]]], newGraphBoxEcc.id);
      */

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
      plotAnimatedNetwork(newGraphBoxNGA.id, parsedData, 1, 100);

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

function sortEccAll(eccArray){
  let sortedEccArray = [];
  for(let x=0; x<11; ++x) {
   sortedEccArray.push([]);
  }
  for(let f=0; f<eccArray[0].length; ++f) {
   let array = [];
   for(let p=0; p<11; ++p) {
     array.push(eccArray[p][f]);
   }
   array.sort();
   array.reverse();
   for(let p=0; p<11; ++p) {
     sortedEccArray[p].push(array[p]);
   }
  }
  return sortedEccArray;
}

function chooseDataset(evt) { // When a dataset is selected from the datasets list on the left of the interface

  let tabID;
  let existingTabs = document.getElementsByClassName("container"); // all the tabs currently opened
  for(let t=0; t<existingTabs.length; ++t) { // for each tab
    if(existingTabs[t].style.display == 'inline-block') { // the workspace is visible
      tabID = existingTabs[t].id; // remember the ID of that workspace
    }
  }

  let fileName = document.querySelector("#" + tabID + " .datasetList").value; // get the name of the imported dataset
  wsChosenDS[tabID.split("ctab")[1]] = fileName; // associates the dataset to the current workspace (format <workspace number, file name>)
  document.querySelector("#" + tabID + " .graphs ul").innerHTML = ""; // deletes all the graphs currently displayed in this workspace

  let fileExtension = fileName.split(".")[1]; // gets the extension of the file (after the first dot)
  let datasetContent = fileMap[fileName];

  switch(fileExtension) {
    case "2d": // soccer match
      drawPresetGraphs("2d", getAllPlayersXYAllFrames(datasetContent), tabID); // draws the default graphs related to the soccer match
      break;
    case "sn": // social network
      drawPresetGraphs("sn", parseSN(datasetContent), tabID); // draws the default graphs related to the social network analysis
      break;
    }

    createPlusSign(tabID); // add the + button to add customized graphs
}

function createPlusSign(containerID) {
  let plusLi = document.createElement("li"); // create a list element (as the other graphs)
  let plusButton = document.createElement("div"); // create a div to put the + sign
  plusButton.className = "graphPreview addNewGraph";
  plusLi.appendChild(plusButton); // add the button to the list (as the other graphs)
  document.querySelector("#"+containerID + " .graphs ul").appendChild(plusLi); // append the list element to the list

  plusButton.addEventListener("click", addCustomGraph, false); // add action when the user clicks on the button
}


function createNewGraphBox(fileExtension, containerID, graphType) {
  let newGraphBox = document.createElement("div");
  let graphLi = document.createElement("li");
  newGraphBox.className = "graphPreview";
  newGraphBox.id = containerID + "g" + fileExtension+"_"+graphType;
  graphLi.appendChild(newGraphBox);

  document.querySelector("#"+containerID + " .graphs ul").appendChild(graphLi);

  newGraphBox.addEventListener("mouseleave", resizeGraph, false);
  newGraphBox.addEventListener("mouseup", resizeGraph, false);

  return newGraphBox;
}

function chooseFramerate(evt) {
	console.log("Framerate chosen");
  wsChosenFramerate[this.parentNode.parentNode.parentNode.parentNode.id.split("ctab")[1]]=this.value;
  //let allGraphs = document.querySelectorAll("#" + this.parentNode.parentNode.parentNode.parentNode.id + " .graphPreview");
  /*let currentFile = wsChosenDS[this.parentNode.parentNode.parentNode.parentNode.id.split("ctab")[1]];
  let datasetData = null;

  if(wsChosenDS[this.parentNode.parentNode.parentNode.parentNode.id.split("ctab")[1]].split(".")[1]=="2d") {
	   datasetData = getAllPlayersXYAllFrames(fileMap[currentFile]);
  }
  else if(wsChosenDS[this.parentNode.parentNode.parentNode.parentNode.id.split("ctab")[1]].split(".")[1]=="sn") {
	  datasetData = parseSN(fileMap[currentFile]);
  }

  let datasetLength = datasetData.length;

  let frameRatio = Math.ceil(datasetLength/(5400*this.value));

  console.log(frameRatio);

  if(frameRatio>1) {
    //console.log(document.querySelector("#" + this.parentNode.parentNode.parentNode.parentNode.id + " .graphs"));
    //console.log(document.querySelector("#" + this.parentNode.parentNode.parentNode.parentNode.id + " .graphs ul"));

    document.querySelector("#" + this.parentNode.parentNode.parentNode.parentNode.id + " .graphs ul").innerHTML = "";
    let frameratedArray = [];

    for(let i=0; i<datasetData.length; ++i) {
      if(i%frameRatio===0) {
        frameratedArray.push(datasetData[i]);
      }
    }

    drawPresetGraphs(currentFile.split(".")[1], frameratedArray, this.parentNode.parentNode.parentNode.parentNode.id); // Presets
    createPlusSign(this.parentNode.parentNode.parentNode.parentNode.id);

  }*/

    setTimeframes(this.parentNode.parentNode.parentNode.parentNode.id.split("ctab")[1]);

}

function setTimeframes(tabNum) {

let sf = wsChosenStartFrame[tabNum];
let ef = wsChosenEndFrame[tabNum];

  let currentFile = wsChosenDS[tabNum];
  let datasetData = null;

  if(wsChosenDS[tabNum].split(".")[1]=="2d") {
	   datasetData = getAllPlayersXYAllFrames(fileMap[currentFile]);
  }
  else if(wsChosenDS[tabNum].split(".")[1]=="sn") {
	  datasetData = parseSN(fileMap[currentFile]);
  }

  let datasetLength = datasetData.length;

  let frameRatio = Math.ceil(datasetLength/(5400*wsChosenFramerate[tabNum]));

  console.log(frameRatio);

  if(frameRatio>1) {

	allGraphs = document.querySelectorAll("#ctab" + tabNum + " .graphs ul li");

	console.log(allGraphs);
	for(let liEl = 0; liEl < allGraphs.length; ++liEl) {
		if(allGraphs[liEl].firstChild.id.includes("custom")) {
		}
		else {
					allGraphs[liEl].remove();
		}

	}
    //document.querySelector("#ctab" + tabNum + " .graphs ul").innerHTML = "";
    let frameratedArray = [];

    for(let i=sf; i<ef; ++i) {
      if(i%frameRatio===0) {
        frameratedArray.push(datasetData[i]);
      }
    }

    drawPresetGraphs(currentFile.split(".")[1], frameratedArray, "ctab"+tabNum); // Presets
    createPlusSign("ctab"+tabNum);

  }
}



function chooseSF(evt) {

	tabID = this.parentNode.parentNode.parentNode.parentNode.id;
  wsChosenStartFrame[tabID.split("ctab")[1]]=this.value;
  document.querySelector("#"+tabID+" .startFrame").value = this.value;
  document.querySelector("#"+tabID+" .frameStartS").value = this.value;
  if(this.value>wsChosenEndFrame[tabID.split("ctab")[1]]) {
    wsChosenEndFrame[tabID.split("ctab")[1]]=this.value;
    document.querySelector("#"+tabID+" .endFrame").value = this.value;
    document.querySelector("#"+tabID+" .frameEndS").value = this.value;
  }

  setTimeframes(tabID.split("ctab")[1]);
  try {
	  // Graph with players
	  let newGraphBoxNG = document.querySelector("#"+this.parentNode.parentNode.parentNode.parentNode.id+"g2d_NG");
	  newGraphBoxNG.innerHTML = "";
	  let fileName = document.querySelector("#"+this.parentNode.parentNode.parentNode.parentNode.id + " .datasetList").value;
	  plotNetwork(newGraphBoxNG.id, getAllPlayersXYAllFrames(fileMap[fileName]),this.value);
  }
  finally {

  }
}

function chooseEF(evt) {
  wsChosenEndFrame[this.parentNode.parentNode.parentNode.parentNode.id.split("ctab")[1]]=this.value;
  document.querySelector("#"+this.parentNode.parentNode.parentNode.parentNode.id+" .endFrame").value = this.value;
  document.querySelector("#"+this.parentNode.parentNode.parentNode.parentNode.id+" .frameEndS").value = this.value;

  if(this.value<wsChosenStartFrame[this.parentNode.parentNode.parentNode.parentNode.id.split("ctab")[1]]) {
    wsChosenStartFrame[this.parentNode.parentNode.parentNode.parentNode.id.split("ctab")[1]]=this.value;
    document.querySelector("#"+this.parentNode.parentNode.parentNode.parentNode.id+" .startFrame").value = this.value;
    document.querySelector("#"+this.parentNode.parentNode.parentNode.parentNode.id+" .frameStartS").value = this.value;
  }

    setTimeframes(this.parentNode.parentNode.parentNode.parentNode.id.split("ctab")[1]);

}

function deleteThisEvent(evt) {
  delete eventWsList[this.parentNode.parentNode.parentNode.parentNode.parentNode.id.split("ctab")[1]][this.parentNode.children[1].innerHTML];
  this.parentNode.remove();
}

function editThisEvent(evt) {
  document.querySelector("#"+this.parentNode.parentNode.parentNode.parentNode.parentNode.id+" .editEventB").style.display = "block";
  document.querySelector("#"+this.parentNode.parentNode.parentNode.parentNode.parentNode.id+" .addEvent").style.display = "none";
  document.querySelector("#"+this.parentNode.parentNode.parentNode.parentNode.parentNode.id+" .eventTitle ~ .select-label").style.display = "none";

  document.querySelector("#"+this.parentNode.parentNode.parentNode.parentNode.parentNode.id+" .eventColor").value = "";
  document.querySelector("#"+this.parentNode.parentNode.parentNode.parentNode.parentNode.id+" .eventTitle").value = this.parentNode.children[1].innerHTML;
  document.querySelector("#"+this.parentNode.parentNode.parentNode.parentNode.parentNode.id+" .eventTitle").disabled = true;
  document.querySelector("#"+this.parentNode.parentNode.parentNode.parentNode.parentNode.id+" .eventTimestamp").value = eventWsList[this.parentNode.parentNode.parentNode.parentNode.parentNode.id.split("ctab")[1]][this.parentNode.children[1].innerHTML][0];
}

function alreadyExist(evTitle, containerID) {
  if(eventWsList[containerID.split("ctab")[1]][evTitle]===undefined) {
    return false;
  }
  else {
    return true;
  }
}

function finalizeEditEvent(evt) {
  // Add to event the event list
  evTitle = document.querySelector("#"+this.parentNode.parentNode.parentNode.id+" .eventTitle").value;
  if(alreadyExist(evTitle, this.parentNode.parentNode.parentNode.id)) {

    // Store in memory
    let eventInfo = [document.querySelector("#"+this.parentNode.parentNode.parentNode.id+" .eventTimestamp").value, document.querySelector("#"+this.parentNode.parentNode.parentNode.id+" .eventColor").value];
    eventWsList[this.parentNode.parentNode.parentNode.id.split("ctab")[1]][evTitle] = eventInfo;

  }
  else {
    alert("This event doesn't exist.");
  }

  document.querySelector("#"+this.parentNode.parentNode.parentNode.id+" .eventTitle").disabled = false;
  document.querySelector("#"+this.parentNode.parentNode.parentNode.id+" .editEventB").style.display = "none";
  document.querySelector("#"+this.parentNode.parentNode.parentNode.id+" .addEvent").style.display = "block";
  document.querySelector("#"+this.parentNode.parentNode.parentNode.id+" .eventTitle ~ .select-label").style.display = "block";

}

function resizeGraph(evt) {
  Plotly.relayout(this.id, {
    width: this.style.width.toString().split("p")[0],
    height: this.style.height.toString().split("p")[0]
  });
}

function computeHeatMatrix(matchData, width, height) {
  let heatMatrix = [];

  for(var x=0; x<height; x++) {
    heatMatrix[x] = [];
    for(var y=0; y<width; y++) {
      heatMatrix[x][y] = 0.0;
    }
  }

  for(let i=0; i<matchData.length; ++i) {
    for(let j=0; j<matchData[i].length; ++j) {
      for(let k=0; k<matchData[i][j].length; ++k) {
        if(parseInt(matchData[i][j][k][0])<width && parseInt(matchData[i][j][k][0])>0 && parseInt(matchData[i][j][k][1])<height && parseInt(matchData[i][j][k][1])>0) {
          heatMatrix[parseInt(matchData[i][j][k][1])][parseInt(matchData[i][j][k][0])]=parseInt(heatMatrix[parseInt(matchData[i][j][k][1])][parseInt(matchData[i][j][k][0])])+1;
        }

      }
    }
  }
  return heatMatrix;
}

function computeAverageHeatMatrix(matchData, width, height) {
  let hm = computeHeatMatrix(matchData, width, height);
  let avheatMatrix = [];


  for(var y=0; y<width; y++) {
    avheatMatrix[y] = 0.0;
  }

  for(var i=0; i<width-1; ++i) {
    for(var j=0; j<height-1; ++j) {
      //console.log(i+", "+j);
      avheatMatrix[i]+=hm[j][i];

    }
  }

  return [avheatMatrix, avheatMatrix];
}

function computeRadixHeat(heatMatrix) {
  for(var x=0; x<heatMatrix.length; x++) {
    for(var y=0; y<heatMatrix[x].length; y++) {
      heatMatrix[x][y] = Math.sqrt(Math.abs(heatMatrix[x][y]));
    }
  }
  return heatMatrix;
}

function createFirstWS() {
  var evObj = document.createEvent('Events');
  evObj.initEvent("click", true, false);
  document.getElementById("addW").dispatchEvent(evObj);
}

function extractFromGravitationalWaves(gravitationalText) {
  return gravitationalText.split("\n");
}

function getSamplesPerSecondGW(gravitationalText) {
  return gravitationalText.split(" samples per second")[0].split(" ")[gravitationalText.split(" samples per second")[0].split(" ").length-1];
}

function generateTimeVectorForGW(gravitationalText) {

  let timeVector = [];
  let samplePerSec = getSamplesPerSecondGW(gravitationalText);
  let numberOfSamples = extractFromGravitationalWaves(gravitationalText).length-3.0;
  for(let i=0; i<numberOfSamples; ++i) {
    timeVector.push(i/samplePerSec);
  }
  return timeVector;
}

function addCustomGraph(evt) {
  document.querySelector("#"+this.parentNode.parentNode.parentNode.parentNode.id+" .modal").style.display = "inline-block";
  document.querySelector("#"+this.parentNode.parentNode.parentNode.parentNode.id+" .close").addEventListener("click", closeModal, false);
  //document.querySelector("#"+this.parentNode.parentNode.parentNode.parentNode.id+" .addV").addEventListener("click", addVariable, false);
  document.querySelector("#"+this.parentNode.parentNode.parentNode.parentNode.id+" .plotHeat").addEventListener("click", plotNewCustomHeat, false);
  document.querySelector("#"+this.parentNode.parentNode.parentNode.parentNode.id+" .plotScatter2d").addEventListener("click", plotNewCustomScatter2D, false);
  document.querySelector("#"+this.parentNode.parentNode.parentNode.parentNode.id+" .plotScatter3d").addEventListener("click", plotNewCustomScatter3D, false);



}

function closeModal(evt) {
  this.parentNode.parentNode.parentNode.style.display = "none";
}

function addVariable(evt) {

  let varContainer = this.parentNode.children[1];

  let listEl = document.createElement("li");

  let infoVariables = document.createElement("span");
infoVariables.innerHTML = "You may access the dataset structure.";


let relation = document.createElement("input");
relation.class="JSCode";
relation.type = "text";
relation.placeholder="JavaScript code";

let returnOut = document.createTextNode("return outData;");

listEl.appendChild(relation);
listEl.appendChild(returnOut);
varContainer.appendChild(listEl);

 // listEl.appendChild(infoVariables);


/*for(let i=0; i<coorList.length; ++i) {
  let nameShown = document.createElement("input");
  nameShown.type = "text";
  nameShown.placeholder = "Name of the variable ("+coorList[i]+")";

  let equalSign = document.createTextNode(" = ");

  let relation = document.createElement("input");
  relation.id=varContainer.id+"var"+coorList[i];
  relation.type = "text";
  relation.placeholder="Relation to other variables";

  listEl.appendChild(nameShown);
  listEl.appendChild(equalSign);
  listEl.appendChild(relation);
  listEl.appendChild(document.createElement("br"));

  varContainer.appendChild(listEl);
} */
}

function addRadioButton(buttonName, num) {
  let radioQ = document.createElement("input");
  radioQ.type = "radio";
  radioQ.name = "displAs"+num;
  radioQ.value = buttonName;

  let labelRadioQ = document.createElement("label");
  labelRadioQ.htmlFor = radioQ;
  labelRadioQ.innerHTML = buttonName;

  return [radioQ, labelRadioQ];
}

function getVariableNamesLisp(fileName) {
  let lispVarList = [];
  for(key in parseBach(fileMap[fileName])[1][0]) {
    lispVarList.push(key);
  }
  return lispVarList;
}

function getVariableArrayLisp(varList, lispDataMap) {
  let arrayMap = {};
  for(var j=0; j<varList.length; ++j) {
    let varArray = [];
    arrayMap[varList[j]] = varArray;
  }
  for(var i=0; i<lispDataMap[1].length; ++i) {
    for (key in lispDataMap[1][i]) {
      arrayMap[key].push(lispDataMap[1][i][key]);
    }
  }
  return arrayMap;
}

function plotNewCustomHeat(evt) {
  //console.log(this.parentNode.parentNode.parentNode.parentNode.id);
  let fileName = wsChosenDS[this.parentNode.parentNode.parentNode.parentNode.parentNode.id.split("tab")[1]];
  let inData = [];
  if(fileName.split(".")[1]==="2d") {

    inData = getAllPlayersXYAllFrames(fileMap[fileName]);
}
else if(fileName.split(".")[1]==="sn"){
  inData = parseSN(fileMap[fileName]);
}
  //let inData = [[[1, 2]], [[1, 2]]];
  eval("function defineCustomCode(inData) {" + this.parentNode.parentNode.children[1].children[2].value+" return outData;}");
  let graphData = defineCustomCode(inData);

  let countGraphs = document.querySelector("#" + this.parentNode.parentNode.parentNode.parentNode.parentNode.id + " .graphs ul").childElementCount;
  // 4 var graphs
  let newCustomGraphBox = createNewGraphBox("2d", this.parentNode.parentNode.parentNode.parentNode.parentNode.id, "custom"+countGraphs);
  plotCustomHeat(graphData, newCustomGraphBox.id);

  //let varMap = getVariableArrayLisp(getVariableNamesLisp(fileMap["chorales.lisp"]), parseBach(fileMap["chorales.lisp"]));

  //let varMap = {"ds": getAllPlayersXYAllFrames(fileMap["CapBotT1Suav.2d"])};
  //let varMap = {"ds": [[[1, 2, 3], [1, 4, 5]], [[1, 7, 9], [2, 5, 6]]]};

  /*let outMap = {};

  let wsID = this.parentNode.parentNode.parentNode.parentNode.id;

console.log(nerdamer(document.querySelector("#"+wsID + " #varx").value, varMap).evaluate().toString());
      outMap["x"] = nerdamer(document.querySelector("#"+wsID + " #varx").value, varMap).evaluate().toString();
      outMap["y"] = nerdamer(document.querySelector("#"+wsID + " #vary").value, varMap).evaluate().toString();
      outMap["z"] = nerdamer(document.querySelector("#"+wsID + " #varz").value, varMap).evaluate().toString();
      outMap["color"] = nerdamer(document.querySelector("#"+wsID + " #varcolor").value, varMap).evaluate().toString();
      outMap["animation"] = nerdamer(document.querySelector("#"+wsID + " #varanimation").value, varMap).evaluate().toString();

console.log(outMap);

  try {
    let containerID = this.parentNode.parentNode.parentNode.parentNode.id;

    let newGraphBox = createNewGraphBox("lisp", containerID, "_"+this.parentNode.parentNode.parentNode.parentNode.children[2].children[0].childElementCount);
    plotData(outMap["x"].split("[")[1].split("]")[0].split(","), outMap["y"].split("[")[1].split("]")[0].split(","), 'scatter', newGraphBox.id, "Title", "x", "y");
  }
  catch(Exception){
    alert("Error");
  }*/


}


function plotNewCustomScatter2D(evt) {
  let fileName = wsChosenDS[this.parentNode.parentNode.parentNode.parentNode.parentNode.id.split("tab")[1]];
  let inData = [];
  if(fileName.split(".")[1]==="2d") {

    inData = getAllPlayersXYAllFrames(fileMap[fileName]);
}
else if(fileName.split(".")[1]==="sn"){
  inData = parseSN(fileMap[fileName]);
}

  eval("function defineCustomCode(inData) {" + this.parentNode.parentNode.children[1].children[2].value+" return outData;}");
  let graphData = defineCustomCode(inData);

  let countGraphs = document.querySelector("#" + this.parentNode.parentNode.parentNode.parentNode.parentNode.id + " .graphs ul").childElementCount;

  // 4 var graphs
  let newCustomGraphBox = createNewGraphBox("2d", this.parentNode.parentNode.parentNode.parentNode.parentNode.id, "customScatter"+countGraphs);
  plotCustomScatter(graphData, newCustomGraphBox.id, 'scatter');
}

function plotNewCustomScatter3D(evt) {
  let fileName = wsChosenDS[this.parentNode.parentNode.parentNode.parentNode.parentNode.id.split("tab")[1]];
  let inData = [];
  if(fileName.split(".")[1]==="2d") {

    inData = getAllPlayersXYAllFrames(fileMap[fileName]);
}
else if(fileName.split(".")[1]==="sn"){
  inData = parseSN(fileMap[fileName]);
}

  eval("function defineCustomCode(inData) {" + this.parentNode.parentNode.children[1].children[2].value+" return outData;}");
  let graphData = defineCustomCode(inData);

  let countGraphs = document.querySelector("#" + this.parentNode.parentNode.parentNode.parentNode.parentNode.id + " .graphs ul").childElementCount;

  // 4 var graphs
  let newCustomGraphBox = createNewGraphBox("2d", this.parentNode.parentNode.parentNode.parentNode.parentNode.id, "customScatter"+countGraphs);
  plotCustomScatter(graphData, newCustomGraphBox.id, 'scatter3d');
}


function arrayAverage(array) {
  let averageArray = [];
  for(let i=0; i<array.length; ++i) {
    averageArray[i]=0;
    for(let j=0; j<array[i].length; ++j) {
      if(!isNaN(array[i][j])) {
        averageArray[i]+=array[i][j];
      }
      if(averageArray[i]===0) {
        averageArray[i]=NaN;
      }
    }
    averageArray[i]=averageArray[i]/array[i].length;
  }
  return [averageArray, averageArray];
}
