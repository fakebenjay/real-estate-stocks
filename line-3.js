//Create svg element
var marginLeft3 = 60
var svg3 = d3.select("#chart-3 .chart")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

var tooltip3 = d3.select("#chart-3")
  .append('div')
  .style('visibility', 'hidden')
  .attr('class', 'my-tooltip')
  .attr('id', 'tooltip-3')

var xScale3 = d3.scaleTime()
  .range([marginLeft3, width - margin.right])
  .domain([new Date('January 3, 2022'), new Date('July 11, 2022')])

// Define X axis
var xAxis3 = d3.axisBottom(xScale3)
  .ticks(12)
  .tickFormat((d) => {
    var year = d.toLocaleString().split('/')[0] == 1 || (d.toLocaleString().split('/')[0] == 4 && d.toLocaleString().split('/')[2].includes('2020')) ? d.toLocaleString().split('/')[2].split(',')[0].slice(2, 4) : ''
    var monthFormat = window.innerWidth > 767 ? 'short' : 'narrow'
    var apostrophe = window.innerWidth > 767 && year !== '' ? " '" : ''

    return d.toLocaleString('default', {
      month: monthFormat
    }) + apostrophe + year
  })

// Add Y scale

var colorScale = d3.scaleLinear()
  .domain([.45, 0, -.45])
  .range(['green', '#f2f2f2', 'red'])

var yScale3 = d3.scaleLinear()
  .domain([.05, -.45])
  .range([0, height - (margin.top + margin.bottom)])

// Define Y axis and format tick marks
var yAxis3 = d3.axisLeft(yScale3)
  .ticks(8)
  .tickFormat(d => numeral(d).format('0%'))

var yGrid3 = d3.axisLeft(yScale3)
  .tickSize(-width + margin.right + marginLeft3, 0, 0)
  .tickFormat("")

svg3.append("text")
  .attr("class", "y-label")
  .attr("text-anchor", "middle")
  .attr("transform", `translate(${20},${(height-margin.bottom)/2}) rotate(-90)`)
  .style('font-size', '11pt')
  .style('fill', 'black')
  .text("% of opening value on January 3, 2022");

// Render Y grid
svg3.append("g")
  .attr("transform", `translate(${marginLeft3},${margin.top})`)
  .attr("class", "grid")
  .style('color', '#777777')
  .style('opacity', '0.3')
  .call(yGrid3)

// Render Y axis
svg3.append("g")
  .attr("transform", `translate(${marginLeft3},${margin.top})`)
  .attr('class', 'y-axis')
  .call(yAxis3)
  .selectAll("text")
  .style('font-size', () => {
    return window.innerWidth > 767 ? '9pt' : '8pt'
  })
  .style('color', d => d > 0 ? 'green' : d < 0 ? 'red' : 'black')
  .attr("transform", "translate(-10,0)")
  .style("text-anchor", "middle")


// Render Y grid
svg3.append("g")
  .attr("transform", `translate(${marginLeft3},${margin.top})`)
  .attr("class", "grid")
  .style('color', '#777777')
  .style('opacity', '0.3')
  .call(yGrid3)

// Render lines g
var linesG3 = svg3.append("g")
  .attr('class', 'lines-3')

var dotsG3 = svg3.append("g")
  .attr('class', 'dots-3')

//Render X axis
svg3.append("g")
  .attr("transform", `translate(0,${height-margin.bottom})`)
  .attr('class', 'x-axis')
  .style('color', 'black')
  .call(xAxis3)
  .selectAll(".tick text")
  .style('font-size', '10pt')
  .raise()

d3.csv("data.csv")
  .then(function(csv) {
    var spx = d3.line()
      .x(function(d) {
        return xScale3(new Date(d.date))
      })
      .y(function(d) {
        return yScale3(d.spxChange) + margin.top;
      });

    var cwk = d3.line()
      .x(function(d) {
        return xScale3(new Date(d.date))
      })
      .y(function(d) {
        return yScale3(d.cwkChange) + margin.top;
      });

    var cbre = d3.line()
      .x(function(d) {
        return xScale3(new Date(d.date))
      })
      .y(function(d) {
        return yScale3(d.cbreChange) + margin.top;
      });

    var jll = d3.line()
      .x(function(d) {
        return xScale3(new Date(d.date))
      })
      .y(function(d) {
        return yScale3(d.jllChange) + margin.top;
      });

    svg3.select('.lines-3')
      .data([csv])
      .append("path")
      .attr("class", "line spx")
      .attr("d", (d) => {
        return spx(d)
      })
      .style('stroke', '#654f6f')
      .style('stroke-width', '4')


    svg3.select('.lines-3')
      .data([csv])
      .append("path")
      .attr("class", "line cwk")
      .attr("d", (d) => {
        return cwk(d)
      })
      .style('stroke', '#ed6a5a')
      .style('stroke-width', '2')


    svg3.select('.lines-3')
      .data([csv])
      .append("path")
      .attr("class", "line cbre")
      .attr("d", (d) => {
        return cbre(d)
      })
      .style('stroke', '#6ba292')
      .style('stroke-width', '2')


    svg3.select('.lines-3')
      .data([csv])
      .append("path")
      .attr("class", "line jll")
      .attr("d", (d) => {
        return jll(d)
      })
      .style('stroke', '#faa916')
      .style('stroke-width', '2')

    svg3.select('.lines-3')
      .append('line')
      .attr("class", "zero")
      .attr("x1", marginLeft3)
      .attr("x2", width - margin.right)
      .attr("y1", yScale3(0) + margin.top)
      .attr("y2", yScale3(0) + margin.top)
      .style('stroke', 'black')
      .style('stroke-width', '2')

    dotsG3.selectAll(".dots-3")
      .data(csv)
      .enter()
      .append("circle") // Uses the enter().append() method
      .attr("class", (d) => {
        var date = new Date(d.date)
        //
        return `dot spx date-${date.toLocaleDateString('en-us', dateOptions).split('day, ')[1].replaceAll(',', '').replaceAll(' ', '-').toLowerCase()}`
      }) // Assign a class for styling
      .attr("cy", function(d) {
        return yScale3(d.spxChange) + margin.top;
      })
      .attr("cx", function(d) {
        return xScale3(new Date(d.date))
      })
      .attr("r", 1)
      .style('fill', '#654f6f')

    dotsG3.selectAll(".dots-3")
      .data(csv)
      .enter()
      .append("circle") // Uses the enter().append() method
      .attr("class", (d) => {
        var date = new Date(d.date)
        return `dot cwk date-${date.toLocaleDateString('en-us', dateOptions).split('day, ')[1].replaceAll(',', '').replaceAll(' ', '-').toLowerCase()}`
      })
      .attr("cy", function(d) {
        return yScale3(d.cwkChange) + margin.top;
      })
      .attr("cx", function(d) {
        return xScale3(new Date(d.date))
      })
      .attr("r", 1)
      .style('fill', '#ed6a5a')

    dotsG3.selectAll(".dots-3")
      .data(csv)
      .enter()
      .append("circle") // Uses the enter().append() method
      .attr("class", (d) => {
        var date = new Date(d.date)
        return `dot cbre date-${date.toLocaleDateString('en-us', dateOptions).split('day, ')[1].replaceAll(',', '').replaceAll(' ', '-').toLowerCase()}`
      })
      .attr("cy", function(d) {
        return yScale3(d.cbreChange) + margin.top;
      })
      .attr("cx", function(d) {
        return xScale3(new Date(d.date))
      })
      .attr("r", 1)
      .style('fill', '#6ba292')

    dotsG3.selectAll(".dots-3")
      .data(csv)
      .enter()
      .append("circle") // Uses the enter().append() method
      .attr("class", (d) => {
        var date = new Date(d.date)
        return `dot jll date-${date.toLocaleDateString('en-us', dateOptions).split('day, ')[1].replaceAll(',', '').replaceAll(' ', '-').toLowerCase()}`
      })
      .attr("cy", function(d) {
        return yScale3(d.jllChange) + margin.top;
      })
      .attr("cx", function(d) {
        return xScale3(new Date(d.date))
      })
      .attr("r", 1)
      .style('fill', '#faa916')

    dotsG3.raise()
    linesG3.raise()
    d3.selectAll('.line').raise()

    svg3.append("rect")
      .attr("transform", `translate(${marginLeft3}, ${margin.top})`)
      .attr("class", "hover-overlay")
      .attr("width", width - margin.right - marginLeft3)
      .attr("height", height - margin.bottom - margin.top)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .data([csv])
      .on("mouseover mousemove touchstart touchmove", function(d) {
        return mouseoverLine(d, 3)
      })
      .on("mouseout", () => {
        svg3.selectAll('.dot')
          .attr('r', 1)

        d3.select(`#tooltip-3`)
          .html("")
          .attr('display', 'none')
          .style("visibility", "hidden")
          .style("left", null)
          .style("top", null);
      });

    d3.selectAll('.hover-overlay')
      .raise()
  })