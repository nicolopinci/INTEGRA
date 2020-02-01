  function calculateAmmortizedDegree(snMapArray, nodeID, k) {
    let counter = [];
    counter.push(0);
    let initialTS = snMapArray[0]["ts"];
    for(let i=1; i<snMapArray.length; ++i) {
      counter.push(counter[i-1]*k);
      if(snMapArray[i]["A"]===nodeID || snMapArray[i]["B"]===nodeID) {
        counter[i] += 1;
      }
    }

    return counter;

  }

  function getNodeIDs(snMapArray) {
    let nodeArray = [];
    for(let i=0; i<snMapArray.length; ++i) {
      nodeArray.push(snMapArray[i]["A"]);
      nodeArray.push(snMapArray[i]["B"]);
    }
    return nodeArray;
  }

  function calcTotAmmDegree(snMapArray, k) {
    let nodeArr = getNodeIDs(snMapArray);

    let totMap = {};

    for(let i=0; i<nodeArr.length/1000; ++i) {
      if(totMap[nodeArr[i]]===undefined) {
        totMap[nodeArr[i]] = calculateAmmortizedDegree(snMapArray, nodeArr[i], k);
      }
    }

    return degreeMapToMatrix(totMap);
  }

  function degreeMapToMatrix(totMap) {
    let outMatrix = [];

    for(key in totMap) {
      outMatrix.push(totMap[key]);
    }
    return outMatrix;
  }

  /*function initiative(snMapArray) {
    let nrSentMessages = [];
    let nrReceivedMessages = [];
    let nodeArr = getNodeIDs(snMapArray);


    for(let i=0; i<snMapArray.length/1000; ++i) {
      if(nrSentMessages[snMapArray[i]["ts"]]===undefined) {
        nrSentMessages[snMapArray[i]["ts"]] = [];
      }
      else
        {
          nrSentMessages[snMapArray[i]["ts"]][snMapArray[i]["A"]] += 1;
        }


        if(nrReceivedMessages[snMapArray[i]["B"]]===undefined) {
          nrReceivedMessages[snMapArray[i]["B"]] = [];
        }
        else
          {
            nrReceivedMessages[snMapArray[i]["B"]] += 1;
          }
      }

  let initiativeRatio = [];
    for(let j=0; j<nrSentMessages.length; ++j) {
      initiativeRatio.push(nrSentMessages[j]/nrReceivedMessages[j]);
    }
    return initiativeRatio;
  } */

  function initiative(snMapArray, nodeID) {
    let sentM = [];
    sentM.push(0);
    let recM = [];
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

  function calcTotInitiative(snMapArray) {
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
        //totMap[nodeArr[i]].push(initiative(snMapArray, nodeArr[i])[0]/initiative(snMapArray, nodeArr[i])[1]);
      }
      /*else {
        totMap[nodeArr[i]].push(calculateAmmortizedDegree(snMapArray, nodeArr[i]));
      }*/
    }
    //console.log(degreeMapToMatrix(totMap));
    return degreeMapToMatrix(totMap);
  }

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
