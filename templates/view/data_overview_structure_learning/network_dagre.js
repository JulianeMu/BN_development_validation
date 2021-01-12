function initialize_network_view(data) {

    let highest_y_pos = 0;

    for (let i = 0; i < initial_groups.length; i++) {

        let found = false;
        for (let j = 0; j < initial_groups[i].variables.length; j++) {
            if (subset_selection.filter(x => x.id === initial_groups[i].variables[j])[0].included_in_structural_learning) {
                found = true;
            }
        }
        if (initial_groups[i].variables.length > 0 && found) {
            d3.select('#' + id_class_groups_in_network_view + initial_groups[i].id).style('height', 70 + 'px')
                .style('margin-top', 10 + 'px')
                .select('p').style('opacity', 1);

            highest_y_pos = get_y_diff(id_class_groups_in_network_view + initial_groups[i].id)[1];
        } else {
            d3.select('#' + id_class_groups_in_network_view + initial_groups[i].id).style('height', 0 + 'px')
                .style('margin-top', 0 + 'px')
                .select('p').style('opacity', 0)
        }
    }

    let g = compute_dagre_layout(data);

    let svg_g = d3.select('#' + id_learnt_model_div).select('svg')//.select('g');

    const circle_radius = 20;


    let circles = svg_g.selectAll("circle")
        .data(g.nodes());

    circles.exit().remove();//remove unneeded circles
    circles.enter()
        .append("circle")
        .attr('id', function (d) {
            return circle_id + d;
        })
        .style("stroke", "white")
        .style('stroke-width', 4 + 'px')
        .style("fill", "var(--main-font-color)")
        .attr("r", circle_radius);

    svg_g.selectAll('circle')
        .attr('id', function (d) {
            return circle_id + d;
        })
        .on('mouseover', function (d, i) {
            let this_circle = this;

            let variable_label = i;
            svg_g.selectAll('*').filter(function () {
                return this !== this_circle && d3.select(this).style('opacity') === '1';
            }).transition().duration(transition_duration/2).style('opacity', 0.2);

            let related_paths = svg_g.selectAll('path').filter(function () {

                return this.id.split(splitter).includes(variable_label);
            }).transition().duration(transition_duration/2).style('opacity', 1);

            related_paths.each(function () {
                let related_nodes = this.id.split(splitter);

                for (let i = 1; i < related_nodes.length; i++) {
                    d3.select('#' + circle_id + related_nodes[i]).transition().duration(transition_duration/2).style('opacity', 1);
                    d3.select('#' + circle_label_id + related_nodes[i]).transition().duration(transition_duration/2).style('opacity', 1);
                }
            })

            d3.select(this).style('opacity', 1);
            d3.select('#' + circle_label_id + i).transition().duration(transition_duration/2).style('opacity', 1);

        })
        .on('mouseout', function (d, i) {

            svg_g.selectAll('path').filter(function () {
                return this.getBoundingClientRect().width > 100;
            }).transition().duration(transition_duration / 2).style('opacity', 0);

            svg_g.selectAll('*').filter(function () {
                return d3.select(this).style('opacity') == 0.2;
            }).transition().duration(transition_duration / 2).style('opacity', 1);
        }).each(function (d) {
        tippy(this, {
            content: d
        });
    })
        .transition()
        .duration(transition_duration)
        .attr("cx", function (d) {
            return g.node(d).x;
        })
        .attr("cy", function (d) {
            let group = get_workflow_step_group(d);
            let y_pos = g.node(d).y + highest_y_pos;
            if (group !== null) {
                let y_diff = get_y_diff(id_class_groups_in_network_view + group);
                //svg_g.selectAll("circle")
                y_pos = y_diff[0] + y_diff[2] / 2 - 22;
            }
            return y_pos;
        }).on('end', function (d) {
        reposition_labels_edges();
    })

    function reposition_labels_edges() {


        let line = d3.line()
            .x(function (d) {
                return d.x;
            })
            .y(function (d) {
                return d.y;
            })
            .curve(d3.curveBasis);

        const space_edges_corner = 20;


        //timeout needs to be set to make sure everything is finally located
        setTimeout(() => {
            //-------------------------------------------------
            // reposition circles in case of variable grouping

            let minus_to_save_space = 0;
            let last_circles = [];
            let space_to_add_related_to_same_group = 0;

            const largest_space_between_circles = 90;
            let last_group = null;

            // // sort circles by y position and x position
            let circles_ = [];
            svg_g.selectAll('circle').each(function (circle, i) {
                circles_.push({
                    id: circle_id + circle,
                    cx: parseFloat(d3.select(this).attr('cx')),
                    cy: parseFloat(d3.select(this).attr('cy'))
                })
            });


            circles_ = circles_.sort((a, b) => (a.cy > b.cy) ?
                1 : ((b.cy > a.cy) ?
                    -1 : (((a.cx > b.cx) ?
                        1 : ((((b.cx > a.cx) ? -1 : 0)))))));

            // reposition circles in case of grouped, too much y-space between circles, and multiple nodes at the same position
            circles_.forEach(function (d, i) {

                if (i !== 0) {

                    d3.select('#' + d.id).attr('cy', parseFloat(d3.select('#' + d.id).attr('cy')) + space_to_add_related_to_same_group);

                    if (d3.select('#' + d.id).attr('cy') - d3.select('#' + (last_circles[last_circles.length - 1].id)).attr('cy') > largest_space_between_circles) {
                        minus_to_save_space = d3.select('#' + d.id).attr('cy') - d3.select('#' + (last_circles[last_circles.length - 1].id)).attr('cy') - largest_space_between_circles;
                        d3.select('#' + d.id).attr('cy', parseFloat(d3.select('#' + d.id).attr('cy')) - minus_to_save_space);

                    }

                    function check_if__pos_is_already_occupied(current_elem) {
                        let occupied = false;
                        for (let circles_index = 0; circles_index < last_circles.length; circles_index++) {

                            if (d3.select(current_elem).attr('cy') === d3.select('#' + (last_circles[last_circles.length - 1].id)).attr('cy') && d3.select(current_elem).attr('cx') === d3.select('#' + (last_circles[last_circles.length - 1].id)).attr('cx')) {

                                d3.select(current_elem).attr('cy', parseFloat(d3.select(current_elem).attr('cy')) + 3.5 * circle_radius + 20);
                                d3.select('#' + id_class_groups_in_network_view + get_workflow_step_group(d.id.split(circle_id)[1]))
                                    .style('height', parseFloat(d3.select('#' + id_class_groups_in_network_view + get_workflow_step_group(d.id.split(circle_id)[1])).style('height')) + 3.5 * circle_radius + 20 + 'px');

                                space_to_add_related_to_same_group += 3.5 * circle_radius + 20;
                                occupied = true;
                            }
                        }

                        if (occupied) {
                            return check_if__pos_is_already_occupied(current_elem);
                        } else {
                            return true;
                        }
                    }

                    check_if__pos_is_already_occupied(d3.select('#' + d.id).node());
                }

                last_group = get_workflow_step_group(d);

                last_circles.push(d);
            });

            //-------------------------------------------------
            // add circle label
            let labels = svg_g.selectAll("text")
                .data(g.nodes());

            labels.exit().remove();//remove unneeded circles
            labels.enter()
                .append("text")
                .attr('id', function (d) {
                    return circle_label_id + d;
                })
                .attr('class', class_network_label_text)
                .attr('dy', -5 + 'px');


            svg_g.selectAll('.' + class_network_label_text).transition().duration(transition_duration)
                .attr("x", function (d) {
                    return parseFloat(d3.select('#' + circle_id + d).attr('cx'));
                })
                .attr('y', function (d) {
                    return parseFloat(d3.select('#' + circle_id + d).attr('cy')) + 2 * circle_radius;
                })
                .attr('dy', -5 + 'px')
                .text(function (d) {
                    if (d.length > 5) {
                        return d.substring(0, 5) + '...';
                    }
                    return d;
                });


            //-------------------------------------------------
            // add edges
            let paths = svg_g.selectAll("path")
                .data(g.edges());

            paths.exit().remove();//remove unneeded circles
            paths.enter()
                .append("path")
                .attr('class', class_network_edges)
                .lower()
                .style('stroke', 'var(--main-font-color)')
                .style('stroke-width', "2")
                .style('fill', 'none')
                .style('opacity', 0);

            svg_g.selectAll('.' + class_network_edges).attr('id', function (d) {
                return path_id + splitter + d.v + splitter + d.w
            }).transition().duration(transition_duration)
                .attr("d", function (d) {

                    let points = [];

                    //let center = parseFloat(d3.select('#' + circle_id + g.edges()[i].v).attr("cx")) + ((parseFloat(d3.select('#' + circle_id + g.edges()[i].w).attr("cx")) - parseFloat(d3.select('#' + circle_id + g.edges()[i].v).attr("cx"))) / 2)
                    let center = parseFloat(d3.select('#' + circle_id + d.v).attr("cx")) + circle_radius + 1.4 * space_edges_corner;

                    points.push({
                        x: parseFloat(d3.select('#' + circle_id + d.v).attr("cx")) + circle_radius,
                        y: parseFloat(d3.select('#' + circle_id + d.v).attr("cy"))
                    })
                    points.push({
                        x: parseFloat(d3.select('#' + circle_id + d.v).attr("cx")) + circle_radius + space_edges_corner,
                        y: parseFloat(d3.select('#' + circle_id + d.v).attr("cy"))
                    })
                    points.push({x: center, y: parseFloat(d3.select('#' + circle_id + d.w).attr("cy"))})
                    points.push({
                        x: parseFloat(d3.select('#' + circle_id + d.w).attr("cx")) - circle_radius - space_edges_corner,
                        y: parseFloat(d3.select('#' + circle_id + d.w).attr("cy"))
                    })
                    points.push({
                        x: parseFloat(d3.select('#' + circle_id + d.w).attr("cx")) - circle_radius,
                        y: parseFloat(d3.select('#' + circle_id + d.w).attr("cy"))
                    })

                    return line(points); //line(g.edge(g.edges()[i]).points)
                })
                .style('opacity', function (d) {

                    let x1 = parseFloat(d3.select('#' + circle_id + d.v).attr("cx")) + circle_radius;
                    let x2 = parseFloat(d3.select('#' + circle_id + d.w).attr("cx")) + circle_radius;

                    if (x2 - x1 > 100) {
                        return 0;
                    }
                    return 1;
                });

            svg_g.selectAll('circle').each(function (circle, i) {
                if (parseFloat(svg_g.style('height')) < parseFloat(d3.select(this).attr('cy')) + 4 * circle_radius) {
                    svg_g.style('height', parseFloat(d3.select(this).attr('cy')) + 4 * circle_radius);
                }
                if (parseFloat(svg_g.style('width')) < parseFloat(d3.select(this).attr('cx')) + 4 * circle_radius) {
                    svg_g.style('width', parseFloat(d3.select(this).attr('cx')) + 4 * circle_radius);
                }
            });
        }, 10);
    }
}

function get_y_diff(id_group_div) {

    let y_pos = document.getElementById(id_group_div).getBoundingClientRect().y -
            document.getElementById(id_network_view_child).getBoundingClientRect().y;

    let y_pos_plus_height = y_pos + document.getElementById(id_group_div).getBoundingClientRect().height;
    let y_height = document.getElementById(id_group_div).getBoundingClientRect().height;

    return [y_pos, y_pos_plus_height, y_height];
}

function compute_dagre_layout(data) {
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

    return g;
}
