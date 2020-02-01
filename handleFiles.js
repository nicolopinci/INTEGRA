var fileMap = {};
var eventWsList = [];
var wsChosenDS = [];
var wsChosenFramerate = [];
var wsChosenStartFrame = [];
var wsChosenEndFrame = [];


document.getElementById('files').addEventListener('change', handleFileSelect, false);
document.getElementById('cfiles').addEventListener('change', importColors, false);


function handleFileSelect(evt) {
  var files = evt.target.files; // FileList object
  var datasetList = document.getElementsByClassName('datasetList')[0];
  var output = [];
  for (var i = 0, f; f = files[i]; i++) {
    if(!isFileAlreadyImported(datasetList, f)) {

      var reader = new FileReader();

      // Closure to capture the file information.
      reader.onload = (function(theFile) {
        return function(e) {
          fileMap[theFile.name] =  e.target.result;
        };
      })(f);

      // Read in the image file as a data URL.
      reader.readAsText(f);

      for(let i=0; i<document.querySelectorAll(".container").length; ++i) {
        let datasetOption = document.createElement("option");
        let optionText = document.createTextNode(f.name);
        datasetOption.value = f.name;
        datasetOption.appendChild(optionText);
        document.getElementsByClassName('datasetList')[i].appendChild(datasetOption);
        document.getElementsByClassName('datasetList')[i].addEventListener("change", setDataset, false);
      }


    }
  }
}

function isFileAlreadyImported(dsl, myFile) {
  for(var d=0; d<dsl.childElementCount; ++d) {
    if (dsl.children[d].value===myFile.name) {
      alert("A file with the name " + myFile.name + " has already been selected. The old file will be mantained.")
      return true;
    }
  }
  return false;
}

// Soccer
function setDataset(evt) {

  matchArray = getAllPlayersXYAllFrames(fileMap[this.value]);

  let tabID;
  let existingTabs = document.getElementsByClassName("container"); // all the tabs currently opened
  for(let t=0; t<existingTabs.length; ++t) { // for each tab
    if(existingTabs[t].style.display == 'inline-block') { // the workspace is visible
      tabID = existingTabs[t].id; // remember the ID of that workspace
    }
  }

  document.querySelector("#" + tabID + " .startFrame").max = matchArray.length; // set the start frame indicator current value to last frame
  document.querySelector("#" + tabID + " .endFrame").max = matchArray.length; // set the end frame indicator to the last frame

  document.querySelector("#" + tabID + " .startFrame").value = 0; // set the start frame indicator current value to 0
  document.querySelector("#" + tabID + " .endFrame").value = matchArray.length; // set the end frame current indicator to the last frame

  document.querySelector("#" + tabID + " .frameStartS").value = 0; // set the numeric start frame indicator current value to 0
  document.querySelector("#" + tabID + " .frameEndS").value = matchArray.length; // set the numeric end frame current indicator to the last frame

  return matchArray;
}

function getAllPlayersXYAllFrames(matchString) {
  let matchArray = matchString.split("\n");
  let matchPosArray = [];
  for(let k=0; k<matchArray.length; ++k) {
  //  let n = "\n";

  if(matchArray[k][0]!=" ") {
    matchArray[k] = " "+matchArray[k];
  }
    matchPosArray.push(getAllPlayersXYFrame(matchArray[k].replace(/  +/g, ' ').split(" ")));
    // replace(/\n/g, n+"  ").replace(/  +/g, ' ').replace(/\n/g, n+"   ").
  }

  return matchPosArray;
}

function getAllPlayersXYFrame(frameArray) {
  let teamPosList = [];
  teamPosList.push(getTeamPlayersXYFrame(frameArray, 1));
  teamPosList.push(getTeamPlayersXYFrame(frameArray, 2));
  return teamPosList;
}

function getTeamPlayersXYFrame(frameArray, team) {
  let posList = [];
  for(let j=1+14*(team-1); j<15+14*(team-1); ++j) {
    posList.push(getNthPlayerXY(frameArray, j));
  }
  return posList;
}

function getNthPlayerXY(frameArray, num) {
  return [getNthPlayerX(frameArray, num), getNthPlayerY(frameArray, num)];
}

function getNthPlayerX(frameArray, num) {
  return frameArray[2*num];
}

function getNthPlayerY(frameArray, num) {
  return frameArray[2*num+1];
}

// Social networks
function parseSN(snText) {
  let timeArray = snText.split("\n");
  let snMapArray = [];
  for(let i=0; i<timeArray.length; ++i) {
    let timestepData = timeArray[i].split(" ");
    snMapArray.push({'A': timestepData[0], 'B': timestepData[1], 'ts': timestepData[2]});
  }
  //console.log(snMapArray);
  return snMapArray;
}

// Bach chorales
function parseBach(lispText) {

    return JSON.parse(fileMap["chorales.lisp"].replace(/\) \(/g, ")(").replace(/ /g,": ").replace(/\(\(/g, "{").replace(/\)\(/g,", ").replace(/\)\)/g, "}, ").replace(/\(/g, "{").replace(/, \)/g, "}").replace(/: /g, "\": ").replace(/, {/g,",{").replace(/, /g, ", \"").replace(/{/g, "{\"").replace(/: {/g, ": [{").replace(/}}/g,"}]},").replace(/(\r\n|\n|\r)/gm,"").replace(/]},{/g, "],").replace(/}]},/g, "}]}"));

}

function getParsedChorale(lispText, num) {
  return parseBach(lispText)[num];
}

function getVariableOfChorale(lispText, num, varName) {
  let variab=[];


  let pc = getParsedChorale(lispText, num);



  for(let k=0; k<pc.length; ++k) {
    variab.push(pc[k][varName]);
  }

  return variab;
}

function parseAnt(antText) {
  let actionsArray = antText.split("\n");
  let actionsMap = {};

  for(let i=0; i<actionsArray.length; ++i) {
    let anActionArray = actionsArray[i].split(" ");
    actionsMap[anActionArray[0]] = [anActionArray[1], anActionArray[2], anActionArray[3], anActionArray[4]];
  }

  return actionsMap;
}

function fromFrameToPosition(frameNr, playerNr, matchArray) {
   let x = matchArray[frameNr][Math.floor(playerNr/15)][playerNr][0];
   let y = matchArray[frameNr][Math.floor(playerNr/15)][playerNr][1];

return [x, y];
}

function calculateEccentricity(frameNr, playerNr, matchArray) {
   referencePosition = fromFrameToPosition(frameNr, playerNr, matchArray);

if(referencePosition[0]<150.0 && referencePosition[0]>0.0) {
   distance = 0.0;
   for(let i=0; i<12; ++i) {
     if(fromFrameToPosition(frameNr, i, matchArray)[0]>0.0 && fromFrameToPosition(frameNr, i, matchArray)[0]<150.0) {
       let tempDistance = Math.pow(Math.pow(fromFrameToPosition(frameNr, i, matchArray)[0]-referencePosition[0], 2)+Math.pow(fromFrameToPosition(frameNr, i, matchArray)[1]-referencePosition[1], 2),0.5);
       if(tempDistance > distance) {
         distance = tempDistance;
       }
     }
   }
   return distance;
}
else {
  return undefined;
}
}

function calculateGlobalEccentricity(playerNr, matchArray) {
  let outArr = [];
  for(let i=0; i<matchArray.length; ++i) {
    outArr.push(calculateEccentricity(i, playerNr, matchArray));
  }
  return outArr;
}

function calculateGlobalEccAll(matchArray) {
  let outArr = [];
  let trArray = [];

  for(let i=0; i<12; ++i) {
    outArr.push(calculateGlobalEccentricity(i, matchArray));
  }


  return outArr;
}
