function splitOnNewLine(dataString) {
  return dataString.split("\n");
}

function getNumberOfRecords(matchString) {
    let matchArray = matchString.split("\n"); // each record is on a new line
    return matchArray.length; // the length is the number of records
}
