//Create SVG area
let svgWidth = 800;
let svgHeight = 500;

//Set margins
let margin = {
    top:60,
    right:60,
    bottom:60,
    left:60
};

//Create chart area
let chartWidth = svgWidth - margin.left - margin.right;
let chartHeight = svgHeight - margin.top - margin.bottom;

//Add the SVG tag
let svg = d3.select('#scatter')
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

//Read in CSV
d3.csv('assets/data/data.csv').then(function (csvInfo) {
    console.log(csvInfo)
});