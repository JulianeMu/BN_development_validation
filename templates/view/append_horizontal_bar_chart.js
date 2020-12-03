
function append_horizontal_bar_chart (div_id, data, data_length) {

    //set up svg using margin conventions - we'll need plenty of room on the left for labels
    var margin = {
        top: 5,
        right: 25,
        bottom: 5,
        left: 80
    };

    var width = parseFloat(d3.select('#' + div_id).style('width')) - margin.left - margin.right,
        height = parseFloat(d3.select('#' + div_id).style('height')) - margin.top - margin.bottom - 25;

    var svg = d3.select("#" + div_id).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleLinear()
        .range([0, width])
        .domain([0, data_length]);

    var y = d3.scaleBand()
        .range([height, 0], .1)
        .padding(.1)
        .domain(data.map(function (d) {
            return d[0];
        }));

    var gy = svg.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y))

    var bars = svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("g")

    //append rects
    bars.append("rect")
        .attr("class", "bar")
        .attr("y", function (d) {
            return y(d[0]);
        })
        .attr("height", y.bandwidth())
        .attr("x", 0)
        .attr("width", function (d) {
            return x(d[1]);
        })
        .style('fill', 'blue');

    // //add a value label to the right of each bar
    // bars.append("text")
    //     .attr("class", "label")
    //     //y position of the label is halfway down the bar
    //     .attr("y", function (d) {
    //         return y(d.name) + y.bandwidth() / 2 + 4;
    //     })
    //     //x position is 3 pixels to the right of the bar
    //     .attr("x", function (d) {
    //         return x(d.value) + 3;
    //     })
    //     .text(function (d) {
    //         return d.value;
    //     })
    //     .style('fill', 'blue');
}