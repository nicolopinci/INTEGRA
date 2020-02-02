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
        //document.getElementsByClassName('datasetList')[i].addEventListener("change", setDataset, false);
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
