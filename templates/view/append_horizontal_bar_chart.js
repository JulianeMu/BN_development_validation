
function append_horizontal_bar_chart (div_id, data, data_length) {

    // to do not display null values
    data = data.filter(x => x[0] !== null);

    //set up svg using margin conventions - we'll need plenty of room on the left for labels
    const margin = {
        top: 5,
        right: 15,
        bottom: 5,
        left: 80
    };

    let width = parseFloat(d3.select('#' + div_id).style('width')) - margin.left - margin.right - 20,
        height = parseFloat(d3.select('#' + div_id).style('height')) - margin.top - margin.bottom - 25;

    let svg = d3.select("#" + div_id).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let x = d3.scaleLinear()
        .range([0, width])
        .domain([0, data_length]);

    let y = d3.scaleBand()
        .range([height, 0], .1)
        .padding(.1)
        .domain(data.map(function (d) {
            return d[0];
        }));

    svg.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y))

    let bars = svg.selectAll(".bar")
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
        .each(function (d) {
            // add tooltip value
            tippy(this, {
                content: d[0]+': '+d[1],
            });
        });
}