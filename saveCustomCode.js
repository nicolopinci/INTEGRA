function exportCode() {
  let currentModal = getCurrentModal();
  let currentWorkspace = getCurrentWorkspace();
  
  let textToSave = "function defineCustomCode(inData) {\n" + currentModal.querySelector(".JSCode").value + "\nreturn outData;\n}";
  let fileTitle = "INTEGRA_" + getCurrentWorkspace().querySelector(".datasetList").value.split(".")[0] + "_" + currentModal.querySelector(".graphTitle").value.replace(/\s/g, '') + ".js";
  
  download(fileTitle, textToSave);
}

// Source: https://ourcodeworld.com/articles/read/189/how-to-create-a-file-and-generate-a-download-with-javascript-in-the-browser-without-a-server
function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}



