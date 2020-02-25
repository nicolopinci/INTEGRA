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
  dialogDiv.id = "dialog"+(document.getElementsByClassName("tabsGroup")[0].children[0].childElementCount-1);
  dialogDiv.className = "dialog";
  
  
  let dialogTitlebar = document.createElement("div");
  dialogTitlebar.className = "titlebar";
  
  let closeButton = document.createElement("button");
  closeButton.className = "close";
  closeButton.name = "close";
  closeButton.innerHTML = "×";
  
  let minimizeButton = document.createElement("button");
  minimizeButton.className = "minimize";
  minimizeButton.name = "minimize";
  minimizeButton.innerHTML = "_";
  
   let hideLeft = document.createElement("button");
  hideLeft.className = "hideLeft";
  hideLeft.name = "hideLeft";
  hideLeft.innerHTML = "<";
  
  dialogDiv.appendChild(dialogTitlebar);
  dialogDiv.appendChild(closeButton);
  dialogDiv.appendChild(minimizeButton);
    dialogDiv.appendChild(hideLeft);
  
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
    
  newContainer.querySelector(".modal").id = "myModal"+(document.getElementsByClassName("tabsGroup")[0].children[0].childElementCount-1);
    
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
    elmnt.style.top = Math.max((elmnt.offsetTop - pos2), 0) + "px";
    elmnt.style.left = Math.max((elmnt.offsetLeft - pos1), 0) + "px";
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
  plusButton.id = "plus"+"_"+containerID;
  plusButton.addEventListener("click", addCustomGraph, false); // add action when the user clicks on the button
}

function createNewGraphBox(fileExtension, containerID, graphType) {

  let closeButton = document.createElement("a");
  closeButton.className = "deleteGraph";
  closeButton.innerHTML = "×";
  closeButton.style.float = "right";
  closeButton.addEventListener("click", deleteThisGraph);

  let newGraphBox = document.createElement("div");
  
  let graphLi = document.createElement("li");
  newGraphBox.className = "graphPreview";
 
  
  newGraphBox.id = containerID + "g" + fileExtension+"_"+graphType;
  graphLi.appendChild(closeButton);
  graphLi.appendChild(newGraphBox);

  document.querySelector("#"+containerID + " .graphs ul").appendChild(graphLi);

  newGraphBox.addEventListener("mouseleave", resizeGraph, false);
  newGraphBox.addEventListener("mouseup", resizeGraph, false);

  return newGraphBox;
}


function deleteThisGraph() {
    this.parentNode.remove();
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
  getCurrentModal().style.display = "none";
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
  document.querySelectorAll("#" + newContainer.id + " .framerate")[0].addEventListener("change", setTimeParameters, false);

  wsChosenStartFrame.push("");
  document.querySelectorAll("#" + newContainer.id + " .frameStartS")[0].addEventListener("change", setTimeParameters, false);

  wsChosenEndFrame.push("");
  document.querySelectorAll("#" + newContainer.id + " .frameEndS")[0].addEventListener("change", setTimeParameters, false);
}

function addEventHandlers(newContainer) {
  document.querySelectorAll("#" + newContainer.id + " .addEvent")[0].addEventListener("click", addAnEvent, false);
}

function addTabHandlers(workspaceTab) {
  workspaceTab.addEventListener("click", openWorkspace, false); // to open the tab when clicked
  simulateClickOnTab(workspaceTab); // When a tab is created, open it
}

function canAddEvents(allGraphs, elem) {
  if(!allGraphs[elem].children[0].className.includes("addNewGraph")) {
		    if(allGraphs[elem].children[1].id.includes("SNAD") || allGraphs[elem].children[1].id.includes("SNINI") ||  allGraphs[elem].children[1].id.includes("_ECC") || allGraphs[elem].children[1].id.includes("+visual")) {
		      return true;
		    }
		    }
		    return false;
}


function redrawAllEvents() {
  
  currentWorkspace = getCurrentWorkspace();

  let currentEvents = eventWsList[currentWorkspace.id.split("ctab")[1]];
  	  let allGraphs = currentWorkspace.querySelectorAll(" .graphs li" );
    
  for(let thisEvent in currentEvents) {

    for(let elem = 0; elem < allGraphs.length; ++elem) {
			  if(canAddEvents(allGraphs, elem)) {
			      let newFramerate = parseFloat(currentWorkspace.querySelector(".framerate").value);
			      let oldTimestamp = parseFloat(currentEvents[thisEvent][0]);
			      let startingPoint = parseFloat(currentWorkspace.querySelector(".frameStartS").value);
			      let currentTS = newFramerate*(oldTimestamp - startingPoint);
		        Plotly.addTraces(allGraphs[elem].children[1], [{ x: [currentTS], name: thisEvent, marker: {color: currentEvents[thisEvent][1]}}]);
		      }
		    }
  }
}


function addAnEvent(evt) {

  currentWorkspace = getCurrentWorkspace();
  
  // Add to event the event list
  evTitle = currentWorkspace.querySelector(" .eventTitle").value;
  myCol = currentWorkspace.querySelector(" .eventColor").value;
  
  if(!alreadyExist(evTitle, currentWorkspace.id)) {
    evLi = document.createElement("li");
    evLi.innerHTML = "<span></span><span>"+evTitle+"</span><span class=\"deleteEvent\">&times</span>";
    currentWorkspace.querySelector(" .ulEvents").appendChild(evLi);

    // Store in memory
    let eventInfo = [currentWorkspace.querySelector(" .eventTimestamp").value, currentWorkspace.querySelector(" .eventColor").value];
    eventWsList[currentWorkspace.id.split("ctab")[1]][evTitle] = eventInfo;

	  // Store as a graph variable
	  let allGraphs = currentWorkspace.querySelectorAll(" .graphs li" );

    // Handle editing and deletion
    evLi.children[2].addEventListener("click", deleteThisEvent, false);

	  for(let elem = 0; elem < allGraphs.length; ++elem) {
			  if(canAddEvents(allGraphs, elem)) {
		        Plotly.addTraces(allGraphs[elem].children[1], [{ x: [eventInfo[0]], name: evTitle, marker: {color: myCol}}]);
		      }
		    }
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

  document.getElementById("c"+this.id).style.display = "inline-block";

  for(var i=0; i<document.querySelectorAll(".ws").length; ++i) {
    document.querySelectorAll(".ws")[i].style.backgroundColor = "white";
    document.querySelectorAll(".ws")[i].style.color = "black";

  }

  document.getElementById(this.id).style.backgroundColor = "#222222";
  document.getElementById(this.id).style.color = "white";
}


// Time parameters
function timeParametersSet(currentWorkspace) {
  return currentWorkspace.querySelector(".framerate").value != "" && currentWorkspace.querySelector(".frameStartS").value != "" && currentWorkspace.querySelector(".frameEndS").value != "";
}

function setTimeParameters(evt) {
    let currentWorkspace = getCurrentWorkspace();
    let tabNum = currentWorkspace.id.split("ctab")[1];
    let currentFile = currentWorkspace.querySelector(".datasetList").value;
    
    if(timeParametersSet(currentWorkspace)) {
      
      wsChosenFramerate[tabNum] = currentWorkspace.querySelector(" .framerate").value;
      wsChosenStartFrame[tabNum] = currentWorkspace.querySelector(" .frameStartS").value;
      wsChosenEndFrame[tabNum] = currentWorkspace.querySelector(" .frameEndS").value;
      
      if(wsChosenDS[tabNum].split(".")[1]=="2d") {
	        datasetData = getAllPlayersXYAllFrames(fileMap[currentFile]);
      }
      else if(wsChosenDS[tabNum].split(".")[1]=="sn") {
	        datasetData = parseSN(fileMap[currentFile]);
      }
      
      let datasetLength = datasetData.length;

      let frameRatio = 1/wsChosenFramerate[tabNum];


      if(frameRatio>=1) {

	      allGraphs = document.querySelectorAll("#ctab" + tabNum + " .graphs ul li");

	      for(let liEl = 0; liEl < allGraphs.length; ++liEl) {
	        let numChild = allGraphs[liEl].childElementCount;
	        
	        if(numChild > 1) {
		        if(!allGraphs[liEl].children[1].id.includes("custom") && !allGraphs[liEl].children[1].id.includes("NGA")) {
		          allGraphs[liEl].remove();
            }
          }
          
          if(allGraphs[liEl].children[0].className.includes("addNewGraph")) {
            allGraphs[liEl].remove();
          }
	      }

      let frameratedArray = [];

      for(let i=wsChosenStartFrame[tabNum]; i<wsChosenEndFrame[tabNum]; ++i) {
        if(i%frameRatio===0) {
            frameratedArray.push(datasetData[i]);
          }
        }

        drawPresetGraphs(currentFile.split(".")[1], frameratedArray, "ctab"+tabNum); // Presets
        createPlusSign("ctab"+tabNum);
        
          redrawAllEvents();

     }
  }
  
            
}



function deleteThisEvent(evt) {

  
  let tabID;
  let existingTabs = document.getElementsByClassName("container"); // all the tabs currently opened
  for(let t=0; t<existingTabs.length; ++t) { // for each tab
    if(this.closest("#"+existingTabs[t].id)!=null) { // the workspace is the one of interest
      tabID = existingTabs[t].id; // remember the ID of that workspace
    }
  }
  
  delete eventWsList[tabID.split("ctab")[1]][this.parentNode.children[1].innerHTML];
    
  	// Store as a graph variable
	let allGraphs = document.querySelectorAll("#"+tabID+" .graphs li div:nth-child(2)" );

  for(let elem = 0; elem < allGraphs.length; ++elem) {
		if(allGraphs[elem].id.includes("SNAD") || allGraphs[elem].id.includes("SNINI") ||  allGraphs[elem].id.includes("_ECC") || allGraphs[elem].id.includes("+visual")) {
		  let allTraces = allGraphs[elem].data;
		  for(let a=0; a<allTraces.length; ++a) {
		    if(allTraces[a].name == this.parentNode.children[1].innerHTML) {
		      Plotly.deleteTraces(allGraphs[elem].id, a);
		    }
		  }

		}
	}
	
  this.parentNode.remove();
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
    
      drawSoccerAnimated("2d", getAllPlayersXYAllFrames(datasetContent), tabID);
      drawPresetGraphs("2d", getAllPlayersXYAllFrames(datasetContent), tabID); // draws the default graphs related to the soccer match
      document.querySelector("#"+document.getElementById(tabID).parentNode.id+" .titlebar").innerHTML = "[Soccer] " + fileName;
      break;
    case "sn": // social network
      drawPresetGraphs("sn", parseSN(datasetContent), tabID); // draws the default graphs related to the social network analysis
      document.querySelector("#"+document.getElementById(tabID).parentNode.id+" .titlebar").innerHTML = "[Social network] " + fileName;
      break;
    }

    createPlusSign(tabID); // add the + button to add customized graphs
    
    setTimeParameters(null);
}
