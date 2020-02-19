# INTEGRA

In order to plot a custom graph, the following procedure has to be followed:

* Import a soccer dataset
* Select it from the dataset list
* Wait until the preset graphs and the + button are loaded
* A modal window will appear
* `inData` is the representation of the parsed data as a map
* `outData` will be used by Plot.ly to plot the custom graph
* It is now possible to write Javascript code to manipulate the initial data properly.

## GVR representing the unsorted eccentricity of the players

```javascript
let outData = [];
outData.push(calculateGlobalEccAll(inData));
```

## Plot a bidimensional scatter graph representing the average eccentricity

```javascript
let outData = [];
let averageEccentricity = arrayAverage(calculateGlobalEccAll(inData));
for(let i=0; i<averageEccentricity.length; ++i) {
   outData.push([i, averageEccentricity[i]]);
}
```
