
function getAllPlayersXYAllFrames(matchString) {
  let matchArray = splitOnNewLine(matchString); // the array contains one line for each timestamp
  let matchPosArray = [];

  // Since the each string in the array can start with one or more spaces, it is necessary to uniform this notation
  // In particular, the beginning of the string should be the only place where there is more than one space
  // At the end of the procedure all the strings have to start with one space followed by a non-space char
  // If there is not a space as first char, therefore it has to be inserted
  // Then, if two or more spaces are found, they are replaced by a single space

  for(let k=0; k<matchArray.length; ++k) {

    if(matchArray[k][0]!=" ") { // if it dows not start with a space
      matchArray[k] = " " + matchArray[k]; // add a space at the beginning
    }

    if(matchArray[k].length > 10) {
      // Now when two spaces or more spaces are found, they are replaced by a single space => replace(/  +/g, ' ')
      // Then the string is split into arrays when a space is found
      matchPosArray.push(getAllPlayersXYFrame(matchArray[k].replace(/  +/g, ' ').split(" ")));
    }
  }
  return matchPosArray;
  // This array contains 2 arrays, each containing the positions of n players
}

function getAllPlayersXYFrame(frameArray) { // returns two arrays, one for the first team and th other for the second team
  let teamPosList = [];
  teamPosList.push(getTeamPlayersXYFrame(frameArray, 1)); // this is the first team
  teamPosList.push(getTeamPlayersXYFrame(frameArray, 2)); // this is the second team
  return teamPosList;
}

function getTeamPlayersXYFrame(frameArray, team) { // returns the list of the players for a given team
  let posList = [];
  let startingPosition = 1; // number of empty elements at the beginning of the array
  if(frameArray[frameArray.length-1]=="") {
    frameArray.pop(); // removes the last (useless) element
  }

  let teamSize = (frameArray.length - startingPosition - 1)/4;

  // teamSize => the number of players for a team (-startingPosition because the array always contains an empty element at the beginning,
  // -1 because the first element is a timestamp, and -endSpaces since the last element can be an empty string)
  // Since a position has two coordinates, the team size is the number of actual coordinates divided by 4 (2 because there are 2 teams
  // and 2 because of the two coordinates)

  if(teamSize > 10) { // Removes lines without a readable content
    for(let j=1+(teamSize-1)*(team-1); j<teamSize+(teamSize-1)*(team-1); ++j) {
      posList.push(getNthPlayerXY(frameArray, j));
    }
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
