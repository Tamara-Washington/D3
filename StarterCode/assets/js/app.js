//Create SVG area
let svgWidth = 800;
let svgHeight = 500;

//Set margins
let margin = {
    top: 60,
    right: 60,
    bottom: 60,
    left: 60
};

//Create chart area
let chartWidth = svgWidth - margin.left - margin.right;
let chartHeight = svgHeight - margin.top - margin.bottom;

//Add the SVG tag
let svg = d3.select('#scatter')
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

//Create the chartGroup
let chartGroup = svg.append('g')
    .attr('transform', `translate (${margin.left}, ${margin.top})`);

//Circle

//Read in CSV
d3.csv('assets/data/data.csv').then(function (csvInfo) {
    console.log(csvInfo);

    //Cast strings to Ints
    csvInfo.forEach(record => {
        record.smokes = +record.smokes;
        record.age = +record.age;
    });

    //Configure the scaling functions
    let yScale = d3.scaleLinear()
        .domain([0, d3.max(csvInfo.map (record => record.smokes))])
        .range([svgHeight, 0]);

    let xScale = d3.scaleLinear()
        .domain([0, d3.max(csvInfo.map (record => record.age))])
        .range([0, svgWidth]);

    //Create axes functions
    let axisBottom = d3.axisBottom(xScale);
    let axisLeft = d3.axisLeft(yScale);

    //Create axes and pass scales 
    let xAxis = d3.axisBottom(xScale);
        yAxis = d3.axisLeft(yScale);

    //Put axes on chart
    chartGroup.append('g')
        .attr('transform', `translate(0, ${chartHeight})`)
        .attr(axisBottom);

    chartGroup.append('g')
        .call(axisLeft)

    //Add circles
});

