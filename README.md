# INTEGRA

## How to plot a custom GVR graph (soccer case study)

* Import a soccer dataset
* Select it from the dataset list
* Wait until the preset graphs and the + button are loaded
* A modal window will appear
* `inData` is the representation of the parsed data as a map
* `outData` will be used by Plot.ly to plot the custom graph
* It is now possible to write Javascript code to manipulate the initial data properly. For instance you can write:
```javascript
let outData = [];
outData.push(calculateGlobalEccAll(inData));
```
and the eccentricity GVR will be displayed in a new box.
