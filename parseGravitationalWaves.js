function extractFromGravitationalWaves(gravitationalText) {
  return gravitationalText.split("\n");
}

function getSamplesPerSecondGW(gravitationalText) {
  return gravitationalText.split(" samples per second")[0].split(" ")[gravitationalText.split(" samples per second")[0].split(" ").length-1];
}

function generateTimeVectorForGW(gravitationalText) {

  let timeVector = [];
  let samplePerSec = getSamplesPerSecondGW(gravitationalText);
  let numberOfSamples = extractFromGravitationalWaves(gravitationalText).length-3.0;
  for(let i=0; i<numberOfSamples; ++i) {
    timeVector.push(i/samplePerSec);
  }
  return timeVector;
}
