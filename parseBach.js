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
