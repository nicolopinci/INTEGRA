function parseSN(snText) { // generates the data structure for a social network
  let timeArray = splitOnNewLine(snText);
  let snMapArray = [];
  for(let i=0; i<timeArray.length; ++i) {
    let timestepData = timeArray[i].split(" ");
    snMapArray.push({'A': timestepData[0], 'B': timestepData[1], 'ts': timestepData[2]});
  }
  return snMapArray;
}
