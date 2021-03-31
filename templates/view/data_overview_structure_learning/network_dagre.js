const circle_radius = 20;

let line = d3.line()
    .x(function (d) {
        return d.x;
    })
    .y(function (d) {
        return d.y;
    })
    .curve(d3.curveBasis);

let show_legend = false;

// arrow head
const markerBoxWidth = 20, markerBoxHeight = 14;
const refX = markerBoxWidth / 2, refY = markerBoxHeight / 2;
const arrowPoints = [[5, 0], [5, 14], [20, 7]];

let computed_dagre_layout_x_pos;

let path_drawing = false;


function initialize_network_view(parent_div_id, zoom, bool_show_legend, data, child_div_id) {
    const space_left = 100;
    const padding = 15;
    show_legend = bool_show_legend;

    let network_child_div = d3.select('#' + parent_div_id)
        .append('div')
        .attr('id', child_div_id)
        .style('position', 'absolute')
        .style('width', 'calc(100% - 2*' + padding + 'px)')
        .style('height', function () {
            if (bool_show_legend) {
                return (parseFloat(d3.select('#' + parent_div_id).style('height')) - padding - 80) + 'px';
            }
            return 100 + '%';
        })
        .style('padding', padding + 'px')
        .style('overflow-y', 'scroll')
        .style('overflow-x', 'scroll')
        .style('zoom', zoom + '%');

    let svg = network_child_div.append("svg")
        .style('width', 'calc(100%-' + space_left + 'px)')
        .style('height', '90%')
        .style('left', space_left + 'px')
        .style('position', 'absolute')
        .style('fill', 'none')

    svg
        .append('defs')
        .append('marker')
        .attr('id', 'arrow')
        .attr('viewBox', [0, 0, markerBoxWidth, markerBoxHeight])
        .attr('refX', refX)
        .attr('refY', refY)
        .attr('markerWidth', markerBoxWidth)
        .attr('markerHeight', markerBoxHeight)
        .attr('orient', 'auto-start-reverse')
        .attr('markerUnits', "userSpaceOnUse")
        .append('path')
        .attr('d', d3.line()(arrowPoints))
        .attr('stroke', 'var(--main-font-color)')
        .attr('fill', 'var(--main-font-color)')
        .style('stroke-width', 1 + 'px');

    if (bool_show_legend) {
        initialize_network_legend(parent_div_id);
    }
    update_group_divs_in_network_view(child_div_id);
    update_network_view(data, parent_div_id, child_div_id);
}


function update_network_view(data, parent_div_id, child_div_id) {

    let mouse_over_circle;
    let circle_start;

    let scrolltop_before = d3.select('#' + child_div_id).node().scrollTop;
    d3.select('#' + child_div_id).node().scrollTop = 0 + 'px';

    if (data !== null) {
        data = identify_sub_graphs(data)

        let highest_y_pos = 0;

        for (let i = 0; i < initial_groups.length; i++) {

            let found = false;
            for (let j = 0; j < initial_groups[i].variables.length; j++) {
                if (data.nodes.filter(x => x.id === initial_groups[i].variables[j]).length > 0) {
                    if (subset_selection.filter(x => x.id === initial_groups[i].variables[j])[0].included_in_structural_learning) {
                        found = true;
                    }
                }
            }
            if (initial_groups[i].variables.length > 0 && found) {
                d3.select('#' + parent_div_id).select('#' + id_class_groups_in_network_view + initial_groups[i].id).style('height', 70 + 'px')
                    .style('margin-top', 10 + 'px')
                    .select('p').style('opacity', 1);

                if (highest_y_pos < get_y_diff(id_class_groups_in_network_view + initial_groups[i].id, parent_div_id, child_div_id)[1])
                    highest_y_pos = get_y_diff(id_class_groups_in_network_view + initial_groups[i].id, parent_div_id, child_div_id)[1];
            } else {
                d3.select('#' + parent_div_id).select('#' + id_class_groups_in_network_view + initial_groups[i].id).style('height', 0 + 'px')
                    .style('margin-top', 0 + 'px')
                    .select('p').style('opacity', 0);
            }
        }

        let g = compute_dagre_layout(data);

        computed_dagre_layout_x_pos = [];
        g.nodes().forEach(function (d) {
            computed_dagre_layout_x_pos.push({
                id: d,
                x: g.node(d).x
            })
        })

        let svg_g = d3.select('#' + parent_div_id).select('svg');

        let ptdata = [];
        let session = [];
        let path;

        if (current_html_page === 2) {
            svg_g.on('mousedown', listen)// function (d) {
                .on("touchstart", listen)
                .on("touchend", ignore)
                .on("touchleave", ignore)
                .on("mouseup", ignore)
                .on("mouseleave", ignore);

        }

        function listen(e) {

            circle_start = mouse_over_circle;

            if (circle_start) {
                path_drawing = true;
                ptdata = []; // reset point data
                path = svg_g.append("path") // start a new line
                    .data([ptdata])
                    .attr("class", "line")
                    .style('stroke', 'var(--main-font-color)')
                    .style('stroke-width', 2 + 'px')
                    .attr("d", line)
                    .attr('transform', 'translate(-100,-20)');

                var point;

                var type = e.type;

                if (type === 'mousemove' || type === "mousedown") {
                    point = d3.pointer(e, d3.select('#' + child_div_id).node());
                } else {
                    // only deal with a single touch input
                    point = d3.touches(this)[0];
                }


                // push a new data point onto the back
                ptdata[0] = {x: point[0], y: point[1]};

                tick();

                if (type === 'mousedown') {
                    svg_g.on("mousemove", onmove)//('mousemove'));
                } else {
                    svg_g.on("touchmove", onmove)//('touchmove'));
                }
            }
        }

        function ignore() {
            svg_g.on("mousemove", null);
            svg_g.on("touchmove", null);

            // skip out if we're not path_drawing
            if (!path_drawing) return;
            path_drawing = false;

            // add newly created line to the path_drawing session
            session.push(ptdata);

            // redraw the line after simplification
            tick();

            path.remove();
            if (mouse_over_circle){ //&& circle_start !== mouse_over_circle) {
                if (learned_structure_data.edges.filter(x => x.edge_from === circle_start && x.edge_to === mouse_over_circle).length === 0) {

                    learned_structure_data.edges.push({
                        edge_from: circle_start,
                        edge_strength: 1,
                        edge_to: mouse_over_circle
                    });
                    learned_structure_data.nodes.find(x => x.id === circle_start).children.push(mouse_over_circle);
                    learned_structure_data.nodes.find(x => x.id === mouse_over_circle).parents.push(circle_start);
                }

                //update_group_divs_in_network_view(child_div_id);
                update_network_view(learned_structure_data, parent_div_id, child_div_id);
                update_all_colors_and_text();
                update_individual_graph_view();

                append_edge_validation(learned_structure_data.edges[learned_structure_data.edges.length - 1], true);

            }
        }


        function onmove(e) {
            var point;

            var type = e.type;

            if (type === 'mousemove') {
                point = d3.pointer(e, d3.select('#' + parent_div_id).node());//this); //d3.mouse(this);
                let transform = d3.zoomTransform(d3.select('#' + parent_div_id).node());
                point = transform.invert(point);  // relative to zoom
            } else {
                // only deal with a single touch input
                point = d3.touches(this)[0];
            }

            // push a new data point onto the back
            ptdata[1] = {x: point[0], y: point[1]};

            tick();
        }

        function tick() {
            path.attr("d", function (d) {
                return line(d);
            }) // Redraw the path:
        }


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
                })
                    .style('opacity', 0.1);

                svg_g.select('defs').style('opacity', 1);

                let related_paths = svg_g.selectAll('.' + class_network_paths).filter(function () {

                    return this.id.split(splitter).includes(variable_label);
                }).style('opacity', 1);


                related_paths.each(function () {
                    let related_nodes = this.id.split(splitter);

                    for (let i = 1; i < related_nodes.length; i++) {
                        svg_g.select('#' + circle_id + related_nodes[i])
                            .style('opacity', 1);
                        svg_g.select('#' + circle_label_id + related_nodes[i])
                            .style('opacity', 1);
                    }
                })

                d3.select(this).style('opacity', 1);
                svg_g.select('#' + circle_label_id + i)
                    .style('opacity', 1);

                related_paths.each(function () {
                    d3.selectAll('#arrow').style('opacity', 1).select('path').style('opacity', 1)
                })

                mouse_over_circle = i;
            })
            .on('mouseout', function () {

                mouse_over_circle = null;

                svg_g.selectAll('path').filter(function () {
                    return this.getBoundingClientRect().width > 100 && d3.select(this).style('stroke') !== 'rgb(255, 0, 0)' && d3.select(this).attr('class') !== 'line';
                })
                    .style('opacity', 0);

                svg_g.selectAll('*').filter(function () {
                    return d3.select(this).style('opacity')+'' === '0.1';
                })
                    .style('opacity', 1);
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
                    let y_diff = get_y_diff(id_class_groups_in_network_view + group, parent_div_id, child_div_id);
                    //svg_g.selectAll("circle")
                    y_pos = y_diff[0] + y_diff[2] / 2 - 22;
                }
                return y_pos;
            })
            .style('stroke', 'white')
            .style('stroke-width', 4 + 'px')
            .style('fill', function (d) {
                if (current_html_page === 3) {
                    return color_distinction_percentage(node_distinction.filter(x => x.node_id === d)[0].percentage);
                }
                return color_subgraphs(data.nodes.filter(x => x.id === d)[0].graph)
            })//'var(--main-font-color)')
            .each(function (d) {
                const instance = this._tippy
                if (instance) {
                    instance.destroy();
                }
                tippy(this, {
                    content: data.nodes.filter(x => x.id === d)[0].label,
                    followCursor: true,
                });

            }).on('end', function () {
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
                svg_g.selectAll('circle').each(function (circle) {
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

                        svg_g.select('#' + d.id).attr('cy', parseFloat(svg_g.select('#' + d.id).attr('cy')) + space_to_add_related_to_same_group);

                        if (svg_g.select('#' + d.id).attr('cy') - svg_g.select('#' + (last_circles[last_circles.length - 1].id)).attr('cy') > largest_space_between_circles) {
                            minus_to_save_space = svg_g.select('#' + d.id).attr('cy') - svg_g.select('#' + (last_circles[last_circles.length - 1].id)).attr('cy') - largest_space_between_circles;
                            svg_g.select('#' + d.id).attr('cy', parseFloat(svg_g.select('#' + d.id).attr('cy')) - minus_to_save_space);

                        }

                        function check_if__pos_is_already_occupied(current_elem) {
                            let occupied = false;
                            for (let circles_index = 0; circles_index < last_circles.length; circles_index++) {

                                if (d3.select(current_elem).attr('cy') === svg_g.select('#' + (last_circles[last_circles.length - 1].id)).attr('cy') && d3.select(current_elem).attr('cx') === svg_g.select('#' + (last_circles[last_circles.length - 1].id)).attr('cx')) {

                                    d3.select(current_elem).attr('cy', parseFloat(d3.select(current_elem).attr('cy')) + 3.5 * circle_radius + 20);
                                    d3.select('#' + parent_div_id).select('#' + id_class_groups_in_network_view + get_workflow_step_group(d.id.split(circle_id)[1]))
                                        .style('height', parseFloat(d3.select('#' + parent_div_id).select('#' + id_class_groups_in_network_view + get_workflow_step_group(d.id.split(circle_id)[1])).style('height')) + 3.5 * circle_radius + 20 + 'px');

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

                        check_if__pos_is_already_occupied(svg_g.select('#' + d.id).node());
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
                    .attr('dy', -5 + 'px')
                ;


                svg_g.selectAll('.' + class_network_label_text)
                    .on('dblclick', function (d, i) {

                        if (current_html_page === 2) {
                            var val = data.nodes.filter(x => x.id === i)[0].label;


                            let node_label = this;
                            let related_node = data.nodes.filter(x => x.id === i)[0];

                            let input = d3.select('#' + id_network_view_child).append('input')
                                .attr('class', 'node_input_text')
                                .attr('type', 'text')
                                .attr('name', 'textInput')
                                .attr('value', val)
                                .style('position', 'absolute')
                                .style('float', 'left')
                                .style('left', d3.select(node_label).attr('x') + 'px')
                                .style('top', d3.select(node_label).attr('y') + 'px')

                            input.node().focus();

                            input.node().onblur = function () {
                                let val = this.value;

                                d3.select(node_label).text(function () {
                                    let l = val;

                                    if (l.length > 5) {
                                        return l.substring(0, 5) + '...';
                                    }
                                    return l;
                                })

                                d3.select('.node_input_text').remove();

                                learned_structure_data.nodes.find(x => x.id === related_node.id).label = val;
                                data = learned_structure_data;

                                //update tippy instance
                                const instance = d3.select('#' + circle_id + related_node.id).node()._tippy
                                if (instance) {
                                    instance.destroy();
                                }

                                tippy(d3.select('#' + circle_id + related_node.id).node(), {
                                    content: related_node.label,
                                    followCursor: true,
                                });
                            }
                        }
                    })
                    .transition().duration(transition_duration)
                    .attr('id', function (d) {
                        return circle_label_id + d;
                    })
                    .attr("x", function (d) {
                        return parseFloat(svg_g.select('#' + circle_id + d).attr('cx'));
                    })
                    .attr('y', function (d) {
                        return parseFloat(svg_g.select('#' + circle_id + d).attr('cy')) + 2 * circle_radius;
                    })
                    .attr('dy', -5 + 'px')
                    .text(function (d) {

                        let l = data.nodes.filter(x => x.id === d)[0].label;

                        if (l.length > 5) {
                            return l.substring(0, 5) + '...';
                        }
                        return l;
                    })

                //-------------------------------------------------
                // add edges


                //TODO need to check why the first line is removed
                // as a workaround, I added the first edge again. Not nice but working
                let list_edges = []
                g.edges().forEach(function (d) {
                    list_edges.push(d)
                })
                list_edges.push(list_edges[0])

                let paths = svg_g.selectAll("path")
                    .data(list_edges)
                    //.enter();

                paths.exit().remove();//remove unneeded circles
                paths.enter()
                    .append("path")
                    .attr('class', class_network_paths)
                    //.lower()
                    .style('opacity', 0);

                setTimeout(() => {

                    svg_g.selectAll('.' + class_network_paths)
                        .transition().duration(transition_duration)
                        .attr('id', function (d) {
                            return path_id + splitter + d.v + splitter + d.w
                        })
                        .attr("d", function (d) {

                            let points = [];

                            //let center = parseFloat(d3.select('#' + circle_id + g.edges()[i].v).attr("cx")) + ((parseFloat(d3.select('#' + circle_id + g.edges()[i].w).attr("cx")) - parseFloat(d3.select('#' + circle_id + g.edges()[i].v).attr("cx"))) / 2)
                            let center = parseFloat(svg_g.select('#' + circle_id + d.v).attr("cx")) + circle_radius + 1.4 * space_edges_corner;

                            points.push({
                                x: parseFloat(svg_g.select('#' + circle_id + d.v).attr("cx")) + circle_radius + 5,
                                y: parseFloat(svg_g.select('#' + circle_id + d.v).attr("cy"))
                            })
                            points.push({
                                x: parseFloat(svg_g.select('#' + circle_id + d.v).attr("cx")) + circle_radius + space_edges_corner,
                                y: parseFloat(svg_g.select('#' + circle_id + d.v).attr("cy"))
                            })
                            points.push({x: center, y: parseFloat(svg_g.select('#' + circle_id + d.w).attr("cy"))})
                            points.push({
                                x: parseFloat(svg_g.select('#' + circle_id + d.w).attr("cx")) - circle_radius - space_edges_corner,
                                y: parseFloat(svg_g.select('#' + circle_id + d.w).attr("cy"))
                            })
                            points.push({
                                x: parseFloat(svg_g.select('#' + circle_id + d.w).attr("cx")) - circle_radius - 15,
                                y: parseFloat(svg_g.select('#' + circle_id + d.w).attr("cy"))
                            })

                            return line(points); //line(g.edge(g.edges()[i]).points)
                        })
                        .style('stroke', function () {
                            return 'var(--main-font-color)';
                        })
                        .style('stroke-width', function (d) {
                            return (data.edges.filter(x => x.edge_from === d.v && x.edge_to === d.w)[0].edge_strength * 10) + 'px'
                        })
                        .style('opacity', function (d) {

                            let x1 = parseFloat(svg_g.select('#' + circle_id + d.v).attr("cx")) + circle_radius;
                            let x2 = parseFloat(svg_g.select('#' + circle_id + d.w).attr("cx")) + circle_radius;

                            if (x2 - x1 > 100) {
                                return 0;
                            }
                            return 1;
                        })
                        .attr('marker-end', 'url(#arrow)')
                        .each(function (d) {

                            const template = document.createElement('div');
                            d3.select(template)
                                .style('height', 300 + 'px')
                                .append('p')
                                .style('margin', 0)
                                .node().innerHTML = '<strong>' + d.v + '</strong>  has an impact on  <strong>' + d.w + '</strong>'

                            // if (current_html_page === 2) {
                            //     const images = [{
                            //         resource: '/BN_development_validation/templates/resources/correct.png'
                            //     }, {
                            //         resource: '/BN_development_validation/templates/resources/cancel.png'
                            //     }, {
                            //         resource: '/BN_development_validation/templates/resources/transfer.png'
                            //     }];
                            //
                            //     images.forEach(function (img, index) {
                            //         d3.select(template)
                            //             .append('img')
                            //             .style('width', 40 + 'px')
                            //             .style('margin-left', 'calc(16.5% - 20px)')
                            //             .style('margin-right', 'calc(16.5% - 20px)')
                            //             .attr('src', img.resource)
                            //             .attr('onclick', 'click_func("' + d.v + '","' + d.w + '","' + radio_button_inputs[index].value + '")')
                            //     })
                            // }


                            const instance = this._tippy
                            if (instance) {
                                instance.destroy();
                            }

                            // if opacity is 0, the tippy should not be visible
                            if (this.style.opacity+'' !== '0') {
                                tippy(this, {
                                    content: template.innerHTML,
                                    followCursor: true,
                                    allowHTML: true,
                                    appendTo: document.body,
                                    interactive: true,
                                    onShow() {
                                        return !path_drawing}
                                });
                            }
                        });


                    let circle_max_y = 0;
                    svg_g.selectAll('circle').each(function () {
                        if (parseFloat(svg_g.style('height')) < parseFloat(d3.select(this).attr('cy')) + 3 * circle_radius) {
                            svg_g.style('height', parseFloat(d3.select(this).attr('cy')) + 3 * circle_radius);
                        }

                        if (circle_max_y < parseFloat(d3.select(this).attr('cy')) + 3 * circle_radius) {
                            circle_max_y = parseFloat(d3.select(this).attr('cy')) + 3 * circle_radius;
                        }

                        if (parseFloat(svg_g.style('width')) < parseFloat(d3.select(this).attr('cx')) + 3 * circle_radius) {
                            svg_g.style('width', parseFloat(d3.select(this).attr('cx')) + 3 * circle_radius);
                        }
                    });

                    if (parseFloat(svg_g.style('height')) > circle_max_y) {
                        svg_g.style('height', circle_max_y);
                    }

                    if (show_legend) {
                        //svg_g.style('height', (parseFloat(svg_g.style('height')) - 120) + 'px');
                        d3.select('#' + child_div_id).style('height', circle_max_y + 80 + 'px')
                        d3.select('#' + parent_div_id).style('height', circle_max_y + 80 + 'px')
                    } else {
                        d3.select('#' + child_div_id).style('height', circle_max_y + 20 + 'px')
                        d3.select('#' + parent_div_id).style('height', circle_max_y + 20 + 'px')
                    }

                    d3.select('#' + child_div_id).node().scrollTop = scrolltop_before;

                }, 10);
            }, 10);
        }
    }


}

function click_func(edge_from, edge_to, index) {
    console.log('click' + index)
    console.log(edge_from + "   " + edge_to)

    //TODO Add line down

    //update_group_divs_in_network_view(child_div_id);
    //update_network_view(learned_structure_data, parent_div_id, child_div_id);
    //update_all_colors_and_text();
    //update_individual_graph_view();

    //append_edge_validation(learned_structure_data.edges[learned_structure_data.edges.length - 1], true);

}

function get_y_diff(id_group_div, parent_div_id, child_div_id) {

    let y_pos = d3.select('#' + parent_div_id).select('#' + id_group_div).node().getBoundingClientRect().y -
        d3.select('#' + child_div_id).node().getBoundingClientRect().y;

    let y_pos_plus_height = y_pos + d3.select('#' + parent_div_id).select('#' + id_group_div).node().getBoundingClientRect().height;
    let y_height = d3.select('#' + parent_div_id).select('#' + id_group_div).node().getBoundingClientRect().height;

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
        g.setEdge(date.edge_from, date.edge_to);
    })

    dagre.layout(g);

    return g;
}


function initialize_network_legend(parent_div_id) {
    let padding = 15;
    let legend_height = 60;

    let legend_div = d3.select('#' + parent_div_id)
        .append('div')
        .style('position', 'absolute')
        .style('bottom', '0px')
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

    x_pos += first_text.node().getBoundingClientRect().width + circle_radius + 10;
    let x_pos_circle_1 = x_pos;

    legend_svg.append('circle')
        .attr('class', class_network_circle)
        .attr('r', circle_radius)
        .attr('cx', x_pos)
        .attr('cy', legend_height / 2)

    x_pos += 100;
    let x_pos_circle_2 = x_pos - 10;
    legend_svg.append('circle')
        .attr('class', class_network_circle)
        .attr('r', circle_radius)
        .attr('cx', x_pos)
        .attr('cy', legend_height / 2)

    x_pos += circle_radius + 5;
    let last_text = legend_svg.append('text')
        .attr('class', class_network_legend_text)
        .attr('dy', 7 + 'px')
        .attr('x', x_pos)
        .attr('y', legend_height / 2)
        .text(get_language__label_by_id(lang_id_legend_effect));

    legend_svg
        .append('defs')
        .append('marker')
        .attr('id', 'arrow')
        .attr('viewBox', [0, 0, markerBoxWidth, markerBoxHeight])
        .attr('refX', refX)
        .attr('refY', refY)
        .attr('markerWidth', markerBoxWidth)
        .attr('markerHeight', markerBoxHeight)
        .attr('orient', 'auto-start-reverse')
        .attr('markerUnits', "userSpaceOnUse")
        .append('path')
        .attr('d', d3.line()(arrowPoints))
        .attr('stroke', 'var(--main-font-color)')
        .attr('fill', 'var(--main-font-color)')
        .style('stroke-width', 1 + 'px');

    legend_svg.append("path")
        .attr('class', class_network_paths)
        .lower()
        .attr('d', function () {
            let points = [];
            points.push({
                x: x_pos_circle_1 + circle_radius,
                y: legend_height / 2
            })
            points.push({
                x: x_pos_circle_2 - circle_radius,
                y: legend_height / 2
            })

            return line(points);
        })
        .attr('marker-end', 'url(#arrow)')


    const legend_arg_strength = [{
        y: legend_height / 4,
        strength: 1
    }, {
        y: legend_height / 2,
        strength: 4
    }, {
        y: legend_height / 4 * 3,
        strength: 8
    }]

    let max_X = parseFloat(last_text.attr('x')) + last_text.node().getBoundingClientRect().width + 70;
    legend_arg_strength.forEach(function (arg_strength) {
        legend_svg.append("path")
            .attr('class', class_network_paths)
            .lower()
            .attr('marker-end', 'url(#arrow)')
            .attr('d', function () {
                let points = [];
                points.push({
                    x: max_X,
                    y: arg_strength.y
                })
                points.push({
                    x: max_X + 50,
                    y: arg_strength.y
                })
                return line(points);
            })
            .style('stroke-width', arg_strength.strength + 'px')
    });

    max_X += 70;
    last_text = legend_svg.append('text')
        .attr('class', class_network_legend_text)
        .attr('dy', 7 + 'px')
        .attr('x', max_X)
        .attr('y', legend_height / 2)
        .text(get_language__label_by_id(lang_id_legend_sureness));

    max_X += last_text.node().getBoundingClientRect().width + 70;

    legend_svg.append('circle')
        .attr('class', class_network_circle)
        .attr('r', circle_radius)
        .attr('cx', max_X)
        .attr('cy', legend_height / 2)
        .style('fill', function () {
            if (current_html_page === 3) {
                return color_distinction_percentage(10);
            }
            return color_subgraphs(0);
        })

    max_X += 40;

    legend_svg.append('circle')
        .attr('class', class_network_circle)
        .attr('r', circle_radius)
        .attr('cx', max_X)
        .attr('cy', legend_height / 2)
        .style('fill', function () {
            if (current_html_page === 3) {
                return color_distinction_percentage(50);
            }
            return color_subgraphs(1);
        })


    max_X += 40;

    legend_svg.append('circle')
        .attr('class', class_network_circle)
        .attr('r', circle_radius)
        .attr('cx', max_X)
        .attr('cy', legend_height / 2)
        .style('fill', function () {
            if (current_html_page === 3) {
                return color_distinction_percentage(100);
            }
            return color_subgraphs(2);
        })

    max_X += 40;

    legend_svg.append('text')
        .attr('class', class_network_legend_text)
        .attr('dy', 7 + 'px')
        .attr('x', max_X)
        .attr('y', legend_height / 2)
        .text(function () {
            if (current_html_page === 3) {
                return get_language__label_by_id(lang_id_legend_node_distinction);
            }
            return get_language__label_by_id(lang_id_legend_individual_graphs);
        });

}

function get_workflow_step_group(variable_id) {
    let group = initial_groups.filter(x => x.variables.includes(variable_id));
    if (group.length > 0) {
        return (group[0].id);
    }
    return null;
}


function update_group_divs_in_network_view(child_div_id) {
    d3.select('#' + child_div_id).selectAll('.' + id_class_groups_in_network_view).remove();

    for (let i = initial_groups.length - 1; i > -1; i--) {

        let group_div = d3.select('#' + child_div_id)
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

        if (group_div.node() !== null) {
            const instance = group_div.node()._tippy
            if (instance) {
                instance.destroy();
            }
        }

        tippy(group_div.node(), {
            content: initial_groups[i].label,
            placement: "top-start",
            appendTo: 'parent',
        });
    }
}


function identify_sub_graphs(list) {

    let node_ids = list.nodes.map(a => a.id);

    let index_graph = 0;

    while (node_ids.length > 0) {
        set_graphs(node_ids[0], index_graph);
        index_graph++;
    }


    function set_graphs(node_id, index_graph) {
        if (node_ids.length > 0 && node_ids.includes(node_id)) {
            list.nodes.find(x => x.id === node_id).graph = index_graph;
            node_ids = node_ids.filter(x => x !== node_id);

            list.nodes.find(x => x.id === node_id).parents.forEach(function (parent) {
                set_graphs(parent, index_graph);
            })

            list.nodes.find(x => x.id === node_id).children.forEach(function (child) {

                set_graphs(child, index_graph);
            })
        }
    }

    return list;
}