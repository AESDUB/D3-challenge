let svgWidth = 960;
let svgHeight = 500;

let margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;

    // Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
let svg = d3.select("#scatter1")
.append("svg")
.attr("width", svgWidth)
.attr("height", svgHeight);

let chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("./assets/data/data.csv").then(function(stateData) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    stateData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });

    // Step 2: Create scale functions
    // ==============================
    let xLinearScale = d3.scaleLinear()
        .domain([8.75, d3.max(stateData, d => d.poverty)])
        .range([0, width]);

    let yLinearScale = d3.scaleLinear()
        .domain([4, d3.max(stateData, d => d.healthcare)])
        .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    let bottomAxis = d3.axisBottom(xLinearScale);
    let leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
    let circlesGroup = chartGroup.selectAll("circle")
        .data(stateData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "15")
        .attr("fill", "#85C1E9")
        .attr("opacity", ".5");

    let circleLabels = chartGroup.selectAll(null)
        .data(stateData)
        .enter()
        .append("text")
        .attr("text-anchor", "middle")
        .attr("font-size", "13px")
        .attr("font-family","Helvetica");

    circleLabels
        .attr("x", (d) => {
            return xLinearScale(d.poverty);
        })
        .attr("y", (d) => {
            return yLinearScale(d.healthcare);
        })
        .text( (d) => {
            return d.abbr;
        })
        .attr("fill", "white");


    // Step 6: Initialize tool tip
    // ==============================
    let toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([22, 5])
        .html(function(d) {
        return (`${d.abbr}`);
        })
        .offset([80,-60])
        .html(function(d){
            return(`${d.abbr}<hr>Poverty level: ${d.poverty}<hr>Lacks Healthcare: ${d.healthcare}`)
        });

    


    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
      })
        // onmouseout event
        .on("mouseout", function(data, index) {
          toolTip.hide(data);
        });


    // Create axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)", `translate(${height + margin.top})`)
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .attr("font-family","Helvetica")
        .text("Lacks Healthcare (%)");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .attr("font-family","Helvetica")
        .text("In Poverty (%)");
    }).catch(function(error) {
    console.log(error);
});



