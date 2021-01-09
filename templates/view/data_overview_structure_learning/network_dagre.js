function initialize_network_view(data) {

    let highest_y_pos = 0;
    for (let i = 0; i < initial_groups.length; i++) {
        if (initial_groups[i].variables.length > 0) {
            d3.select('#' + id_class_groups_in_network_view + initial_groups[i].id).style('height', 60 + 'px')
                .style('margin-top', 10 + 'px')
                .style('margin-left', 10 + 'px')

            highest_y_pos = get_y_diff(id_class_groups_in_network_view + initial_groups[i].id)[1];
        }
    }

    // Create a new directed graph
    let g = new dagre.graphlib.Graph();

    const node_width = 50, node_height = 50;
    // Set an object for the graph label
    g.setGraph({rankdir: 'LR', align: 'UL', ranker: 'longest-path'});

    // Default to assigning a new object as a label for each new edge.
    g.setDefaultEdgeLabel(function () {
        return {};
    });


    data.nodes.forEach(function (date) {
        g.setNode(date.id, {label: date.label, width: node_width, height: node_height});
    })

    data.edges.forEach(function (date) {
        date.edge_to.forEach(function (edge_to) {
            g.setEdge(date.edge_from, edge_to);
        })
    })

    dagre.layout(g);

    let svg_g = d3.select('#' + id_learnt_model_div).select('svg').select('g');

    const circle_radius = 20;

    svg_g.selectAll("circle")
        .data(g.nodes())
        .enter()
        .append("circle")
        .attr('id', function (d) {
            return circle_id + d;
        })
        .style("stroke", "white")
        .style('stroke-width', 4+'px')
        .style("fill", "black")
        .attr("r", circle_radius)
        .attr("cx", function (d) {
            return g.node(d).x;
        })
        .attr("cy", function (d) {
            let group = check_if_variable_is_grouped(d);
            if (group !== null) {
                let y_diff = get_y_diff(id_class_groups_in_network_view + group);
                return y_diff[0] + y_diff[2]/2 - 15;
            }
            return g.node(d).y + highest_y_pos;
        })
        .on('mouseover', function (d, i) {
            console.log(i)
            let this_circle = this;

            svg_g.selectAll('*').filter(function () {
                return this !== this_circle && d3.select(this).style('opacity') == 1;
            }).transition().duration(transition_duration).style('opacity', 0.2);

            svg_g.selectAll('path').filter(function () {
                return this.id.split(splitter).includes(i);
            }).transition().duration(transition_duration).style('opacity', 1);

            d3.select(this).style('opacity', 1);
        })
        .on('mouseout', function (d, i) {

            svg_g.selectAll('path').filter(function () {
                return this.getBoundingClientRect().width > 100;
            }).transition().duration(transition_duration/2).style('opacity', 0);

            svg_g.selectAll('*').filter(function () {
                return d3.select(this).style('opacity') == 0.2;
            }).transition().duration(transition_duration/2).style('opacity', 1);


        });


    let line = d3.line()
        .x(function (d) {
            return d.x;
        })
        .y(function (d) {
            return d.y;
        })
        .curve(d3.curveBasis);


    const space_edges_corner = 20;


    for (let i = 0; i < g.edges().length; i++) {
        svg_g.append("path")
            .attr('id', path_id + splitter + g.edges()[i].v + splitter + g.edges()[i].w)
            .lower()
            .style('stroke', 'black')
            .style('stroke-width', "2")
            .style('fill', 'none')
            .attr("d", function (d) {

                let points = [];

                //let center = parseFloat(d3.select('#' + circle_id + g.edges()[i].v).attr("cx")) + ((parseFloat(d3.select('#' + circle_id + g.edges()[i].w).attr("cx")) - parseFloat(d3.select('#' + circle_id + g.edges()[i].v).attr("cx"))) / 2)
                let center = parseFloat(d3.select('#' + circle_id + g.edges()[i].v).attr("cx")) + circle_radius + 1.5 * space_edges_corner;

                points.push({x: parseFloat(d3.select('#' + circle_id + g.edges()[i].v).attr("cx")) + circle_radius, y: parseFloat(d3.select('#' + circle_id + g.edges()[i].v).attr("cy"))})
                points.push({x: parseFloat(d3.select('#' + circle_id + g.edges()[i].v).attr("cx")) + circle_radius + space_edges_corner, y: parseFloat(d3.select('#' + circle_id + g.edges()[i].v).attr("cy"))})
                points.push({x: center, y: parseFloat(d3.select('#' + circle_id + g.edges()[i].w).attr("cy"))})
                points.push({x: parseFloat(d3.select('#' + circle_id + g.edges()[i].w).attr("cx")) - circle_radius - space_edges_corner, y: parseFloat(d3.select('#' + circle_id + g.edges()[i].w).attr("cy"))})
                points.push({x: parseFloat(d3.select('#' + circle_id + g.edges()[i].w).attr("cx")) - circle_radius, y: parseFloat(d3.select('#' + circle_id + g.edges()[i].w).attr("cy"))})

                return line(points); //line(g.edge(g.edges()[i]).points)
            })
            .style('opacity', function (d) {
                if (this.getBoundingClientRect().width > 100) {
                    return 0;
                }
                return 1;
            });
    }

}