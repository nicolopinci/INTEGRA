// Utilities
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

function groupMatrix(inMatrix, red) {
  let outMatrix = [];
  for(let i=0; i<inMatrix.length; ++i) {
    outMatrix.push([]);
    for(let j=0; j<inMatrix[i].length/red; ++j) {
      for(let k=j; k<j+red; ++k) {
        if(j>0) {
          if(outMatrix[i][j]===undefined) {
            outMatrix[i][j] = 0;
          }
          outMatrix[i][j]+=inMatrix[i][j*red+k]-inMatrix[i][j*red+k-1];
        }
        else {
          {
            outMatrix[i][j]=0;

          }
      }

      }
    }
  }
  console.log(outMatrix);
  return outMatrix;
}

// Connected nodes
function nrConnectedNodes(snMapArray) { // Ei
  let counter = [];
  for(let i=0; i<snMapArray.length; ++i) {
    if(counter[snMapArray[i]["A"]]===undefined) {
      counter[snMapArray[i]["A"]]=0;
    }
    counter[snMapArray[i]["A"]] += 1;

    // Find neighbours
    let partialMap = snMapArray.filter(function (elem) {
  return elem.A === snMapArray[i]["A"];
});

var partialArray = partialMap.map(function (elem) {
  return elem.B;
});

let uniqueNeighbours = [...new Set(partialArray)];

// Calculate number exits
for(let j=0; j<uniqueNeighbours.length; ++j) {
    for(let k=0; k<uniqueNeighbours.length; ++k) {
      for(let l=0; l<snMapArray.length; ++l)  {
        if(snMapArray[i]["A"]===uniqueNeighbours[j] && snMapArray[i]["B"]===uniqueNeighbours[k]) {
          counter[snMapArray[i]["A"]] += 1;
        }
      }
    }
}

  }

  return counter;
}

// Unique vertices
function calculateUniqueVertices(snMapArray) {
  let vertices = [];
  for(let i=0; i<snMapArray.length; ++i) {
    vertices.push(snMapArray[i]["A"]);
    vertices.push(snMapArray[i]["B"]);
  }
  let unique = [...new Set(vertices)];
  let counter = unique.length;

  return counter;
}

// Utility to count the nodes
function getNodeIDs(snMapArray) { // returns the list of all the nodes
    let nodeArray = [];
    for(let i=0; i<snMapArray.length; ++i) {
      nodeArray.push(snMapArray[i]["A"]); // origin node
      nodeArray.push(snMapArray[i]["B"]); // destination node
    }
    return nodeArray; // list with all the nodes
  }

// SOCIAL NETWORKS
// Ammortized degree
function calcTotAmmDegree(snMapArray, k) { // Ammortized degree for the whole dataset
    let nodeArr = getNodeIDs(snMapArray);
    let totMap = {};

    for(let i=0; i<nodeArr.length; ++i) { // For all the nodes
      if(totMap[nodeArr[i]]===undefined) {
        totMap[nodeArr[i]] = calculateAmmortizedDegree(snMapArray, nodeArr[i], k); // calculate the ammortized degree for that node
      }
    }
    return degreeMapToMatrix(totMap);
  }

function calculateAmmortizedDegree(snMapArray, nodeID, k) { // Ammortized degree for the node nodeID
    let counter = [];
    counter.push(0);
    for(let i=1; i<snMapArray.length; ++i) {
      counter.push(counter[i-1]*k);
      if(snMapArray[i]["A"]===nodeID || snMapArray[i]["B"]===nodeID) { // one of the two nodes is nodeID
        counter[i] += 1;
      }
    }
    return counter;
  }


// Initiative
function calcTotInitiative(snMapArray) { // calculate the initiative for the whole dataset
    let nodeArr = getNodeIDs(snMapArray);
    let totMap = {};

    for(let i=0; i<nodeArr.length; ++i) {
      if(totMap[nodeArr[i]]===undefined) {
        totMap[nodeArr[i]] = [];

        for(let k=0; k<snMapArray.length; ++k) {
          totMap[nodeArr[i]][k] = initiative(snMapArray, nodeArr[i])[0][k]/initiative(snMapArray, nodeArr[i])[1][k];
        }
      }
      else {
        for(let k=0; k<snMapArray.length; ++k) {
          totMap[nodeArr[i]][k] = initiative(snMapArray, nodeArr[i])[0][k]/initiative(snMapArray, nodeArr[i])[1][k];
        }
      }
    }
    return degreeMapToMatrix(totMap);
  }

function initiative(snMapArray, nodeID) { // initiative for a single node
    let sentM = []; // sent messages list
    sentM.push(0);
    let recM = []; // received messages list
    recM.push(0);

    for(let i=1; i<snMapArray.length; ++i) {
      sentM.push(sentM[i-1]);
      recM.push(recM[i-1]);

      if(snMapArray[i]["A"]===nodeID) {
        sentM[i] += 1;
      }

      if(snMapArray[i]["B"]===nodeID) {
        recM[i] += 1;
      }
    }
    return [sentM, recM];
  }


// Activity peaks
function calculateActivityPeaks(inMatrix) {
  let outMatrix = [];
  for(let i=0; i<inMatrix.length; ++i) {
    outMatrix.push([]);
    for(let j=0; j<inMatrix[i].length; ++j) {
        if(j>0) {
          outMatrix[i][j]=inMatrix[i][j]-inMatrix[i][j-1];
        }
        else {
          {
            outMatrix[i][j]=inMatrix[i][j]-inMatrix[i][0];

          }


      }
    }
  }
  return outMatrix;
}

function degreeMapToMatrix(totMap) {
  let outMatrix = [];

  for(key in totMap) {
    outMatrix.push(totMap[key]);
  }
  return outMatrix;
}


// Local clustering
function calculateLocalClustering(snMapArray) {

  let E = nrConnectedNodes(snMapArray);
  let k = calculateUniqueVertices(snMapArray);

  let c = [];

  for(let i=0; i<E.length; ++i) {
    if(isNaN(E[i])) {
      c.push(NaN);
    }
    else {
    c.push(Math.log(E[i]/(k*(k-1)))*(-1));
  }
  }

  return c;
}

function calculateLocalClusteringThroughTime(snMapArray) {
  let lct = [];


  for(let i=0; i<snMapArray.length; ++i) {
    let partialMap = snMapArray.filter(function (elem) {
  return elem.ts <= snMapArray[i]["ts"];
});
    lct.push(calculateLocalClustering(partialMap));
  }
  return lct;
}

// SOCCER
// Eccentricity
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

// Heat matrices
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
