let keys, x, y, z;


function initialize_stacked_bar_chart(node_under_inv) {

    d3.select('#' + steps_structure_validation_div).selectAll('*').remove();

    d3.select('#' + steps_structure_validation_div).append('svg')
        .attr('id', 'chart')
        .attr('width', 650)
        .attr('height', 420)

    let transformed_data = [];

    for (let i=0; i< node_under_inv.cpt.length; i++) {
        let current_cpt = node_under_inv.cpt[i];

        let data_row = {};
        for (let j = 0; j< current_cpt.probability.length; j++) {
            let current_prob = current_cpt.probability[j];

            data_row[current_prob.outcome] = current_prob.prob
        }

        let row_str = "";
        for (let k = 0; k< current_cpt.parents.length; k++) {
            if (k>0) {
                row_str += "___"
            }
            row_str += current_cpt.parents[k].parent_node + '-' + current_cpt.parents[k].parent_state
        }

        data_row.parents = row_str;

        transformed_data.push(data_row)
    }

    chart(transformed_data)


    function chart(transformed_data) {

        keys = Object.keys(transformed_data[0]).filter(x => x !== "parents");

        let svg = d3.select("#chart"),
            margin = {top: 35, left: 85, bottom: 0, right: 15},
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom;

        y = d3.scaleBand()
            .range([margin.top, height - margin.bottom])
            .padding(0.1)
            .paddingOuter(0.2)
            .paddingInner(0.2)

        x = d3.scaleLinear()
            .range([margin.left, width - margin.right])

        let yAxis = svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .attr("class", "y-axis")

        let xAxis = svg.append("g")
            .attr("transform", `translate(0,${margin.top})`)
            .attr("class", "x-axis")

        // z = d3.scaleOrdinal()
        //     .range(["steelblue", "darkorange", "lightblue"])
        //     .domain(keys);

        z = d3.scaleSequential().domain([1, keys.length])
                .interpolator(d3.interpolatePuRd);

        update(transformed_data, 0)


    }
}

function update(input, speed) {
    let data = input;
    let svg = d3.select("#chart");

    data.forEach(function (d) {
        d.total = d3.sum(keys, k => +d[k]).toFixed(0)
        return d
    })

    x.domain([0, d3.max(data, d => d.total)]).nice();

    svg.selectAll(".x-axis").transition().duration(speed)
        .call(d3.axisTop(x).ticks(null, "s"))

    y.domain(data.map(d => d.parents));

    svg.selectAll(".y-axis").transition().duration(speed)
        .call(d3.axisLeft(y).tickSizeOuter(0))

    let group = svg.selectAll("g.layer")
        .data(d3.stack().keys(keys)(data), d => d.key)

    group.exit().remove()

    group.enter().insert("g", ".y-axis").append("g")
        .classed("layer", true)
        .attr("fill", d => z(keys.indexOf(d.key) + 1))
        .attr('id', function (d) {
            return 'group_' + keys.indexOf(d.key);
        });


    let bars = svg.selectAll("g.layer").selectAll("rect")
        .data(d => d, e => e.data.parents, d => d.key);

    bars.exit().remove()

    bars.enter().append("rect")
        .attr("height", y.bandwidth())
        .merge(bars)
        .transition().duration(speed)
        .attr("y", d => y(d.data.parents))
        .attr("x", d => x(d[0]))
        .attr("width", d => x(d[1]) - x(d[0]));

    d3.selectAll('.layer').each(function (d) {
        let state = keys[this.id.split('group_')[1]];
        d3.select(this).selectAll('rect').each(function (d,i) {
            console.log(d.data[state])

            //console.log(this)
            tippy(this, {
                content: state+': '+d.data[state].toFixed(2),
            });
        })
    });
}
