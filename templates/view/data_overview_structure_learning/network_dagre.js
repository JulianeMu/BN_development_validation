const circle_radius = 20;

let line = d3.line()
    .x(function (d) {
        return d.x;
    })
    .y(function (d) {
        return d.y;
    })
    .curve(d3.curveBasis);

function initialize_network_view(parent_div_id, zoom, bool_show_legend) {
    const space_left = 100;
    const padding = 15;

    let network_child_div = d3.select('#' + parent_div_id)
        .append('div')
        .attr('id', id_network_view_child)
        .style('position', 'absolute')
        .style('width', 'calc(100% - 2*' + padding + 'px)')
        .style('height', function () {
            return 100 + '%';
        })
        .style('padding', padding + 'px')
        .style('overflow-y', 'scroll')
        .style('overflow-x', 'scroll')
        .style('zoom', zoom + '%');

    network_child_div.append("svg")
        .style('width', 'calc(100%-' + space_left + 'px)')
        .style('height', '90%')
        .style('left', space_left + 'px')
        .style('position', 'absolute')
        .style('fill', 'none')


    if (bool_show_legend) {
        initialize_network_legend();
    }
    update_group_divs_in_network_view();
    update_network_view(learned_structure_data);
}

function update_network_view(data) {

    if (data !== null) {
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

        let svg_g = d3.select('#' + id_network_view).select('svg')//.select('g');


        let circles = svg_g.selectAll("circle")
            .data(g.nodes());

        circles.exit().remove();//remove unneeded circles
        circles.enter()
            .append("circle")
            .attr('id', function (d) {
                return circle_id + d;
            })
            .attr('class', class_network_circle)
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
                }).transition().duration(transition_duration / 2).style('opacity', 0.2);

                let related_paths = svg_g.selectAll('path').filter(function () {

                    return this.id.split(splitter).includes(variable_label);
                }).transition().duration(transition_duration / 2).style('opacity', 1);

                related_paths.each(function () {
                    let related_nodes = this.id.split(splitter);

                    for (let i = 1; i < related_nodes.length; i++) {
                        d3.select('#' + circle_id + related_nodes[i]).transition().duration(transition_duration / 2).style('opacity', 1);
                        d3.select('#' + circle_label_id + related_nodes[i]).transition().duration(transition_duration / 2).style('opacity', 1);
                    }
                })

                d3.select(this).style('opacity', 1);
                d3.select('#' + circle_label_id + i).transition().duration(transition_duration / 2).style('opacity', 1);

            })
            .on('mouseout', function (d, i) {

                svg_g.selectAll('path').filter(function () {
                    return this.getBoundingClientRect().width > 100;
                }).transition().duration(transition_duration / 2).style('opacity', 0);

                svg_g.selectAll('*').filter(function () {
                    return d3.select(this).style('opacity') == 0.2;
                }).transition().duration(transition_duration / 2).style('opacity', 1);
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
            }).each(function (d) {
            tippy(this, {
                content: d,
                followCursor: true,
            });
        }).on('end', function (d) {
            reposition_labels_edges();
        })

        function reposition_labels_edges() {

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
                    .attr('class', class_network_label_text)
                    .attr('dy', -5 + 'px');


                svg_g.selectAll('.' + class_network_label_text).transition().duration(transition_duration)
                    .attr('id', function (d) {
                        return circle_label_id + d;
                    })
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


function initialize_network_legend() {
    let padding = 15;
    let legend_height = 60;

    let legend_div = d3.select('#' + id_network_view)
        .append('div')
        .style('position', 'absolute')
        .style('bottom', '20px')
        .style('width', 'calc(100% - ' + 10 + 'px)')
        .style('height', legend_height + 'px')
        .style('border-radius', 'var(--div-border-radius)')
        .style('border', '6px solid var(--main-font-color)')

    let legend_svg = legend_div.append('svg')
        .style('width', '100%')
        .style('height', '100%');

    let x_pos = padding;
    let first_text = legend_svg.append('text')
        .attr('class', class_network_legend_text)
        .attr('dy', 7 + 'px')
        .attr('x', x_pos)
        .attr('y', legend_height / 2)
        .text(get_language__label_by_id(lang_id_legend_reason));

    x_pos += first_text.node().getBoundingClientRect().width + circle_radius + 5;
    let x_pos_circle_1 = x_pos;

    legend_svg.append('circle')
        .attr('class', class_network_circle)
        .attr('r', circle_radius)
        .attr('cx', x_pos)
        .attr('cy', legend_height / 2)

    x_pos += 100;
    let x_pos_circle_2 = x_pos;
    legend_svg.append('circle')
        .attr('class', class_network_circle)
        .attr('r', circle_radius)
        .attr('cx', x_pos)
        .attr('cy', legend_height / 2)

    x_pos += circle_radius + 5;
    legend_svg.append('text')
        .attr('class', class_network_legend_text)
        .attr('dy', 7 + 'px')
        .attr('x', x_pos)
        .attr('y', legend_height / 2)
        .text(get_language__label_by_id(lang_id_legend_effect));

    legend_svg.append("path")
        .attr('class', class_network_edges)
        .lower()
        .attr('d', function () {
            let points = [];
            points.push({
                x: x_pos_circle_1 + circle_radius,
                y: legend_height / 2
            })
            points.push({
                x: x_pos_circle_2 + circle_radius,
                y: legend_height / 2
            })
            return line(points);
        })
}

function get_workflow_step_group(variable_id) {
    let group = initial_groups.filter(x => x.variables.includes(variable_id));
    if (group.length > 0) {
        return (group[0].id);
    }
    return null;
}


function update_group_divs_in_network_view() {
    d3.select('#' + id_network_view_child).selectAll('.' + id_class_groups_in_network_view).remove();

    for (let i = initial_groups.length - 1; i > -1; i--) {

        let group_div = d3.select('#' + id_network_view_child)
            .append('div')
            .lower()
            .attr('class', id_class_groups_in_network_view)
            .attr('id', id_class_groups_in_network_view + initial_groups[i].id)
            .style('width', 100 + '%')
            .style('height', 0 + 'px')
            .style('position', 'relative')
            .style('float', 'left')
            .style('opacity', 0.5)
            .style('background-color', color_clinical_workflow_groups(initial_groups.findIndex(x => x.id === initial_groups[i].id) + 1))
            .style('border-radius', 6 + 'px')
            .append('p')
            .attr('id', 'network_group_label_' + initial_groups[i].id)
            .attr('class', 'network_group_label')
            .text(function () {
                if (initial_groups[i].label.length > 5) {
                    return initial_groups[i].label.substr(0, 5) + '...'
                }
                return initial_groups[i].label
            })
            .style('padding-left', 5 + 'px')
            .style('opacity', 0);

        tippy(group_div.node(), {
            content: initial_groups[i].label,
            placement: "top-start",
            appendTo: 'parent',
        });
    }
}
