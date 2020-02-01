colorMap = {};

function importColors(e) {
 handleColorFiles(e);
}

function handleColorFiles(evt) {
  var files = evt.target.files; // FileList object
  var colorList = document.getElementsByClassName('eventColor')[0];
  var output = [];
  for (var i = 0, f; f = files[i]; i++) {

      var reader = new FileReader();

      // Closure to capture the file information.
      reader.onload = (function(theFile) {
        return function(e) {
          colorMap[theFile.name] =  JSON.parse(e.target.result);

          for(let k=0; k<document.querySelectorAll(".container").length; ++k) {

            for(let j=0; j<colorMap[theFile.name].data.length;++j) {
            let colorOption = document.createElement("option");
            let optionText = document.createTextNode(colorMap[theFile.name].data[j][0].type);
            colorOption.value = colorMap[theFile.name].data[j][0].type;
            colorOption.appendChild(optionText);
            document.getElementsByClassName('eventColor')[k].appendChild(colorOption);
            document.getElementsByClassName('eventColor')[k].addEventListener("change", setColor, false);
        }

    }

        };
      })(f);

      // Read in the image file as a data URL.
      reader.readAsText(f);



    }

}

function setColor() {

let newCS = lookForColor(this.value);
  let updatedCS = {
    "colorscale": newCS
    //'marker.color': 'red'
};


for(let k=0; k<document.querySelectorAll("#" + this.parentNode.parentNode.parentNode.parentNode.id + " .graphPreview").length-1; ++k) {
    Plotly.update(document.querySelectorAll("#" + this.parentNode.parentNode.parentNode.parentNode.id + " .graphPreview")[k], updatedCS, {});
}

  //document.querySelectorAll("#" + this.parentNode.parentNode.parentNode.parentNode.id + " .graphPreview")[0].colorscale;

}

function lookForColor(colorType) {
  for(key in colorMap) {
    for(let j=0; j<colorMap[key]["data"].length; ++j) {
      if(colorMap[key]["data"][j][0].type === colorType) {
        return colorMap[key]["data"][j][0].colorscale;
      }

    }
  }
}
