document.getElementById("addW").addEventListener("click", addTab, false);
document.addEventListener("DOMContentLoaded", createFirstWS, false);

// Elements creation and manipulation
function addTab() {
  var workspaceTab = createTabElement();
  var newContainer = createContainerElement();
  addEventHandlers(newContainer);
  addTabHandlers(workspaceTab);
  handleWorkspaceStatus(newContainer);
}

function createTabElement() {
  var workspaceTab = document.createElement("li");
  //workspaceTab.style.zIndex=document.getElementsByClassName("tabsGroup")[0].children[0].childElementCount*(-1)-100;
  workspaceTab.appendChild(document.createTextNode("Workspace "+document.getElementsByClassName("tabsGroup")[0].children[0].childElementCount));
  workspaceTab.id = "tab"+document.getElementsByClassName("tabsGroup")[0].children[0].childElementCount;
  workspaceTab.className ="ws";
  workspaceTab.style.display = "none";
  document.getElementsByClassName("tabsGroup")[0].children[0].appendChild(workspaceTab);

  return workspaceTab;
}



function createContainerElement() {

  body = document.getElementsByTagName("body")[0];

  let dialogDiv = document.createElement("div");
  dialogDiv.style = "width:40vw; height:40vh;";
  dialogDiv.style.boxShadow = "0px 0px 10px grey";
  dialogDiv.id = "dialog"+(document.getElementsByClassName("tabsGroup")[0].children[0].childElementCount-1);
  dialogDiv.className = "dialog";
  
  /*let titleContainer = document.createElement("div");
  titleContainer.style.position = "fixed";
  titleContainer.name = "titleCont";*/
  
  let dialogTitlebar = document.createElement("div");
  dialogTitlebar.className = "titlebar";
  
  let closeButton = document.createElement("button");
  closeButton.className = "close";
  closeButton.name = "close";
     closeButton.innerHTML = "×";
  closeButton.style.color = "white";
  
  let minimizeButton = document.createElement("button");
  minimizeButton.className = "minimize";
  minimizeButton.name = "minimize";
    minimizeButton.innerHTML = "_";
  minimizeButton.style.color = "white";
  
   let hideLeft = document.createElement("button");
  hideLeft.className = "hideLeft";
  hideLeft.name = "hideLeft";
  hideLeft.innerHTML = "<";
  hideLeft.style.color = "white";
  
  dialogDiv.appendChild(dialogTitlebar);
  dialogDiv.appendChild(closeButton);
  dialogDiv.appendChild(minimizeButton);
    dialogDiv.appendChild(hideLeft);
  
  // dialogDiv.appendChild(titleContainer);
  
  let container0 = document.getElementById("container");

  var newContainer = document.createElement("div");
  newContainer.innerHTML = container0.innerHTML;
  newContainer.className = "container";
  newContainer.style.display = "none";
  newContainer.id = "ctab"+(document.getElementsByClassName("tabsGroup")[0].children[0].childElementCount-1);
  
  dialogDiv.appendChild(newContainer);
  dialogDiv.style.display = "inherit";
  body.appendChild(dialogDiv);
  
  dragElement(dialogDiv);
  dialogDiv.addEventListener("click", activateFocus);
  closeButton.addEventListener("click", closeWindow);
  minimizeButton.addEventListener("click", minimizeWindow);
    hideLeft.addEventListener("click", hideLeftMenu);
  //dialogDiv.addEventListener("drag", activateFocus);
    
	return newContainer;
}

function closeWindow() {
  this.parentNode.remove();
}

function minimizeWindow() {
  let dialogBox = this.parentNode;
  if(dialogBox.style.resize === "none") {
    dialogBox.style.height = "40vh";
    dialogBox.style.width = "40vw";
    dialogBox.style.overflow = "scroll";
    dialogBox.style.resize = "both";
  }
  else {
    dialogBox.style.height = "32px";
    dialogBox.style.width = "256px";
    dialogBox.style.overflow = "hidden";
    dialogBox.style.resize = "none";
  }
}

function hideLeftMenu() {
  let dialogBox = this.parentNode;
  let leftMenu = document.querySelector("#"+dialogBox.id + " .leftMenu");
  
  if(leftMenu.style.display === "none") {
    leftMenu.style.display = "inline-block";
    this.innerHTML = "<";
  }
  else {
    leftMenu.style.display = "none";
    this.innerHTML = ">";
  }
}



function activateFocus() {
  let zIndexMax = 0;
  for(var i=0; i<document.querySelectorAll(".dialog").length; ++i) {
    if(parseInt(document.querySelectorAll(".dialog")[i].style.zIndex) > zIndexMax) {
        zIndexMax = parseInt(document.querySelectorAll(".dialog")[i].style.zIndex);
    }
  }
  this.style.zIndex = parseInt(zIndexMax+1);
  
  // Normalize indexes
  let zIndexMin = Number.POSITIVE_INFINITY;
  for(var i=0; i<document.querySelectorAll(".dialog").length; ++i) {
    if(parseInt(document.querySelectorAll(".dialog")[i].style.zIndex) < zIndexMin) {
        zIndexMin = parseInt(document.querySelectorAll(".dialog")[i].style.zIndex);
    }
  }
  
  for(var i=0; i<document.querySelectorAll(".dialog").length; ++i) {
         document.querySelectorAll(".dialog")[i].style.zIndex = parseInt(document.querySelectorAll(".dialog")[i].style.zIndex - zIndexMin);
  }
}

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.querySelector("#"+elmnt.id + " .titlebar")) {
    // if present, the header is where you move the DIV from:
    document.querySelector("#"+elmnt.id + " .titlebar").onmousedown = dragMouseDown;
    //document.getElementById(elmnt.id + "titlebar").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
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

function createFirstWS() {
  var evObj = document.createEvent('Events');
  evObj.initEvent("click", true, false);
  document.getElementById("addW").dispatchEvent(evObj);
}

function resizeGraph(evt) {
  Plotly.relayout(this.id, {
    width: this.style.width.toString().split("p")[0],
    height: this.style.height.toString().split("p")[0]
  });
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


// Handlers
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
  //document.querySelectorAll("#" + newContainer.id + " .startFrame")[0].addEventListener("change", chooseSF, false);
  document.querySelectorAll("#" + newContainer.id + " .frameStartS")[0].addEventListener("change", chooseSF, false);

  wsChosenEndFrame.push("");
  //document.querySelectorAll("#" + newContainer.id + " .endFrame")[0].addEventListener("change", chooseEF, false);
  document.querySelectorAll("#" + newContainer.id + " .frameEndS")[0].addEventListener("change", chooseEF, false);
}

function addEventHandlers(newContainer) {
  document.querySelectorAll("#" + newContainer.id + " .addEvent")[0].addEventListener("click", addAnEvent, false);
  document.querySelectorAll("#" + newContainer.id + " .editEventB")[0].addEventListener("click", finalizeEditEvent, false);
}

function addTabHandlers(workspaceTab) {
  workspaceTab.addEventListener("click", openWorkspace, false); // to open the tab when clicked
  simulateClickOnTab(workspaceTab); // When a tab is created, open it
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

function simulateClickOnTab(workspaceTab) {
  // Open the tab when created
  var evObj = document.createEvent('Events');
  evObj.initEvent("click", true, false);
  workspaceTab.dispatchEvent(evObj);
}

function openWorkspace(evt) {
  for(var i=0; i<document.querySelectorAll(".container").length; ++i) {
    //document.querySelectorAll(".container")[i].style.zIndex--;
  }
  document.getElementById("c"+this.id).style.display = "inline-block";

  for(var i=0; i<document.querySelectorAll(".ws").length; ++i) {
    document.querySelectorAll(".ws")[i].style.backgroundColor = "white";
    document.querySelectorAll(".ws")[i].style.color = "black";

  }

  document.getElementById(this.id).style.backgroundColor = "#222222";
  document.getElementById(this.id).style.color = "white";
}


// Parameters
function chooseFramerate(evt) {
	//console.log("Framerate chosen");
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

	//console.log(allGraphs);
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

let tabID;
  let existingTabs = document.getElementsByClassName("container"); // all the tabs currently opened
  for(let t=0; t<existingTabs.length; ++t) { // for each tab
    if(this.closest("#"+existingTabs[t].id)!=null) { // the workspace is the one of interest
      tabID = existingTabs[t].id; // remember the ID of that workspace
    }
  }

  let fileName = document.querySelector("#" + tabID + " .datasetList").value; // get the name of the imported dataset

  wsChosenStartFrame[tabID.split("ctab")[1]]=this.value;
  //document.querySelector("#"+tabID+" .startFrame").value = this.value;
  //document.querySelector("#"+tabID+" .frameStartS").value = this.value;
  if(this.value>wsChosenEndFrame[tabID.split("ctab")[1]]) {
    wsChosenEndFrame[tabID.split("ctab")[1]]=this.value;
    //document.querySelector("#"+tabID+" .endFrame").value = this.value;
    //document.querySelector("#"+tabID+" .frameEndS").value = this.value;
  }

  setTimeframes(tabID.split("ctab")[1]);
  try {
	  // Graph with players
	  let newGraphBoxNG = document.querySelector("#"+tabID+"g2d_NG");
	  newGraphBoxNG.innerHTML = "";
	  plotNetwork(newGraphBoxNG.id, getAllPlayersXYAllFrames(fileMap[fileName]),this.value);
  }
  finally {

  }
}

function chooseEF(evt) {

let tabID;
  let existingTabs = document.getElementsByClassName("container"); // all the tabs currently opened
  for(let t=0; t<existingTabs.length; ++t) { // for each tab
    if(this.closest("#"+existingTabs[t].id)!=null) { // the workspace is the one of interest
      tabID = existingTabs[t].id; // remember the ID of that workspace
    }
  }

  let fileName = document.querySelector("#" + tabID + " .datasetList").value; // get the name of the imported dataset
  
  
  wsChosenEndFrame[tabID.split("ctab")[1]]=this.value;
  //document.querySelector("#"+this.parentNode.parentNode.parentNode.parentNode.id+" .endFrame").value = this.value;
  //document.querySelector("#"+this.parentNode.parentNode.parentNode.parentNode.id+" .frameEndS").value = this.value;

  if(this.value<wsChosenStartFrame[tabID.split("ctab")[1]]) {
    wsChosenStartFrame[tabID.split("ctab")[1]]=this.value;
    //document.querySelector("#"+this.parentNode.parentNode.parentNode.parentNode.id+" .startFrame").value = this.value;
    //document.querySelector("#"+this.parentNode.parentNode.parentNode.parentNode.id+" .frameStartS").value = this.value;
  }

    setTimeframes(tabID.split("ctab")[1]);

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

function alreadyExist(evTitle, containerID) {
  if(eventWsList[containerID.split("ctab")[1]][evTitle]===undefined) {
    return false;
  }
  else {
    return true;
  }
}

function chooseDataset(evt) { // When a dataset is selected from the datasets list on the left of the interface

  let tabID;
  let existingTabs = document.getElementsByClassName("container"); // all the tabs currently opened
  for(let t=0; t<existingTabs.length; ++t) { // for each tab
    if(this.closest("#"+existingTabs[t].id)!=null) { // the workspace is the one of interest
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
      document.querySelector("#"+document.getElementById(tabID).parentNode.id+" .titlebar").innerHTML = "[Soccer] " + fileName;
      break;
    case "sn": // social network
      drawPresetGraphs("sn", parseSN(datasetContent), tabID); // draws the default graphs related to the social network analysis
      document.querySelector("#"+document.getElementById(tabID).parentNode.id+" .titlebar").innerHTML = "[Social network] " + fileName;
      break;
    }

    createPlusSign(tabID); // add the + button to add customized graphs
}
