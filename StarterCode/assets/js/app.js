let svgWidth = 960;
let svgHeight = 500;

let margin = {
top: 20,
right: 40,
bottom: 80,
left: 100
};

let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;

let svg = d3
.select("#scatter")
.append("svg")
.attr("width", svgWidth)
.attr("height", svgHeight);

let chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
let chosenXAxis = "smokes"
let chosenYAxis = "age"

// function used for updating x-scale var upon click on axis label
function xScale(mockData, chosenXAxis) {
  // create scales
let xLinearScale = d3.scaleLinear()
    .domain([d3.min(mockData, d => d[chosenXAxis]),
    d3.max(mockData, d => d[chosenXAxis])
    ])
    .range([0, width]);

return xLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
let bottomAxis = d3.axisBottom(newXScale);

xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

return xAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

let label;

if (chosenXAxis === "smokes") {
    label = "Years Smok:";
}
else {
    label = "Years Smoking:";
}

let toolTip = d3.select('body').append('div').classed('tooltip', true);

//circlesGroup.call(toolTip);
circlesGroup.on("mouseover", function(event, d) {
    //toolTip.show(data);
    toolTip.style('display', 'block')
        .html(`${d.age}<br>${label} ${d[chosenXAxis]}`)
        .style('left', event.pageX+'px')
        .style('top', event.pageY+'px');

})
    // onmouseout event
    .on("mouseout", function(data, index) {
      //toolTip.hide(data);
toolTip.style('display', 'none');
    });

return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv('assets/data/data.csv').then(function(mockData, err) {
if (err) throw err;

  // parse data
mockData.forEach(function(data) {
    data.smokes = +data.smokes;
    data.age = +data.age;
});

  // xLinearScale function above csv import
let xLinearScale = xScale(mockData, chosenXAxis);

  // Create y scale function
let yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(mockData, d => d.age)])
    .range([height, 0]);

  // Create initial axis functions
let bottomAxis = d3.axisBottom(xLinearScale);
let leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
let xAxis = chartGroup.append("g")
    .classed("active", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
let circlesGroup = chartGroup.selectAll("circle")
    .data(mockData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d.age))
    .attr("r", 20)
    .attr("fill", "pink")
    .attr("opacity", ".5")
    .text(mockData.state);

  // Create group for two x-axis labels
let labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "smokes") 
    .text("Smokes (%)");

labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") 

  // append y axis
chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Age(Median)");

  // updateToolTip function above csv import
circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

  // x axis labels event listener
labelsGroup.selectAll("text")
    .on("click", function() {
    
    let value = d3.select(this).attr("value");
    if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // updates x scale for new data
        xLinearScale = xScale(mockData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

    }
    });
}).catch(function(error) {
console.log(error);
});
