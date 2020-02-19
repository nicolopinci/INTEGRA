# INTEGRA

In order to plot a custom graph, the following procedure has to be followed:

* Import a soccer dataset
* Select it from the dataset list
* Wait until the preset graphs and the + button are loaded
* A modal window will appear
* `inData` is the representation of the parsed data as a map
* `outData` will be used by Plot.ly to plot the custom graph
* It is now possible to write Javascript code to manipulate the initial data properly.

## Different types of data for different kinds of plots

### GVR and heatmap

In order to draw a GVR or a heatmap, `outData` should be an array of arrays, where the sub-arrays represent the rows. Each element of this structure represents the value in a certain position (that will be shown as a color with a certain intensity).

### Scatter graph in two dimensions

In order to draw a bidimensional scatter graph, `outData` should be an array of arrays, where a sub-array encodes the coordinates of a position. For example

```javascript
outData = [[1, 2, 3], [3, 2, 1]];
```
represents two points, one with coordinates (x, y, z) = (1, 2, 3) and the other with coordinates (x, y, z) = (3, 2, 1).

## GVR representing the unsorted eccentricity of the players

```javascript
let outData = [];
outData.push(calculateGlobalEccAll(inData));
```

## Plot a bidimensional scatter graph representing the average eccentricity

``` 
let frame = [];
let averageEccentricity = arrayAverage(calculateGlobalEccAll(inData))[0];
for(let i=0; i<averageEccentricity.length; ++i) {
   frame.push([i, averageEccentricity[i]]);
}
let outData = [];
outData.push(frame); 
```
