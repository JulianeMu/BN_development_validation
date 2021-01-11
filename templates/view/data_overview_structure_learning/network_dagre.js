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

    let circles = svg_g.selectAll("circle")
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
            let group = get_workflow_step_group(d);
            if (group !== null) {
                let y_diff = get_y_diff(id_class_groups_in_network_view + group);

                //svg_g.selectAll("circle")
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

            let related_paths = svg_g.selectAll('path').filter(function () {
                return this.id.split(splitter).includes(i);
            }).transition().duration(transition_duration).style('opacity', 1);

            related_paths.each(function () {
                let related_nodes = this.id.split(splitter);

                for (let i=1; i< related_nodes.length; i++) {
                    d3.select('#' + circle_id + related_nodes[i]).transition().duration(transition_duration).style('opacity', 1);
                }
            })

            d3.select(this).style('opacity', 1);
        })
        .on('mouseout', function (d, i) {

            svg_g.selectAll('path').filter(function () {
                return this.getBoundingClientRect().width > 100;
            }).transition().duration(transition_duration/2).style('opacity', 0);

            svg_g.selectAll('*').filter(function () {
                return d3.select(this).style('opacity') == 0.2;
            }).transition().duration(transition_duration/2).style('opacity', 1);
        }).each(function (d) {
            tippy(this, {
                content: d
            });
        });

    // sort circles by y position and x position
    circles = circles.sort((a,b) => (parseFloat(d3.select('#' + circle_id + a).attr('cy')) > parseFloat(d3.select('#' + circle_id + b).attr('cy'))) ?
        1 : ((parseFloat(d3.select('#' + circle_id + b).attr('cy')) > parseFloat(d3.select('#' + circle_id + a).attr('cy'))) ?
            -1 : (((parseFloat(d3.select('#' + circle_id + a).attr('cx')) > parseFloat(d3.select('#' + circle_id + b).attr('cx'))) ?
            1: ((((parseFloat(d3.select('#' + circle_id + b).attr('cx')) > parseFloat(d3.select('#' + circle_id + a).attr('cx')))? -1 : 0)))))));

    let minus_to_save_space = 0;
    let last_circles = [];
    let space_to_add_related_to_same_group = 0;

    const largest_space_between_circles = 70;

    // reposition circles in case of grouped, too much y-space between circles, and multiple nodes at the same position
    circles.each(function (d,i) {
        if (i !== 0) {

            d3.select(this).attr('cy', parseFloat(d3.select(this).attr('cy')) + space_to_add_related_to_same_group);

            if (d3.select(this).attr('cy') - d3.select(last_circles[last_circles.length-1]).attr('cy') > largest_space_between_circles) {
                minus_to_save_space = d3.select(this).attr('cy') - d3.select(last_circles[last_circles.length-1]).attr('cy') - largest_space_between_circles;
                d3.select(this).attr('cy', parseFloat(d3.select(this).attr('cy')) - minus_to_save_space);
            }

            function check_if__pos_is_already_occupied(current_elem) {
                let occupied = false;
                for (let circles_index = 0; circles_index < last_circles.length; circles_index ++) {

                    if (d3.select(current_elem).attr('cy') === d3.select(last_circles[circles_index]).attr('cy') && d3.select(current_elem).attr('cx') === d3.select(last_circles[circles_index]).attr('cx')) {

                        d3.select(current_elem).attr('cy', parseFloat(d3.select(current_elem).attr('cy')) + 3 * circle_radius);

                        d3.select('#' + id_class_groups_in_network_view + get_workflow_step_group(d))
                            .style('height', parseFloat(d3.select('#' + id_class_groups_in_network_view + get_workflow_step_group(d)).style('height')) + 3 * circle_radius + 'px');

                        space_to_add_related_to_same_group += 3 * circle_radius;
                        occupied = true;
                    }
                }

                if (occupied) {
                    return check_if__pos_is_already_occupied(current_elem);
                } else {
                    return true;
                }
            }

            check_if__pos_is_already_occupied(this);
        }
        last_circles.push(this);
    })


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
                let center = parseFloat(d3.select('#' + circle_id + g.edges()[i].v).attr("cx")) + circle_radius + 1.4 * space_edges_corner;

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

function get_y_diff(id_group_div) {
    let y_pos = document.getElementById(id_group_div).getBoundingClientRect().y - document.getElementById(id_network_view).getBoundingClientRect().y;
    let y_pos_plus_height = y_pos + document.getElementById(id_group_div).getBoundingClientRect().height;
    let y_height = document.getElementById(id_group_div).getBoundingClientRect().height;

    return [y_pos, y_pos_plus_height, y_height];
}