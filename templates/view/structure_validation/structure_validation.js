
function initialize_edge_validation() {

    const circle_radius_structure_val = circle_radius / 4 * 3;

    const radio_button_inputs = [{
        left: 20,
        value: 'correct',
    }, {
        left: 50,
        value: 'wrong'
    }, {
        left: 80,
        value: 'turnaround'
    }];

    let legend_top = d3.select('#' + edge_validation_div).append('div')
        .style('float', 'right')
        .style('width', 50 + '%')
        .style('height', 30 + 'px')
    //.style('background-color', 'green');

    legend_top.append('svg').style('width', 100 + '%')
        .style('height', 100 + '%')
    radio_button_inputs.forEach(function (r_input) {
        legend_top.select('svg').append('text')
            .attr('x', r_input.left + '%')
            .attr('y', 20 + 'px')
            .style('text-anchor', "middle")
            .style('fill', 'var(--main-font-color)')
            .text(r_input.value)
    });


    let edges_validation_div_content = d3.select('#' + edge_validation_div).append('div').attr('class', validation_div_content_class);
    let edges_sort = learned_structure_data.edges.sort((a, b) => (a.edge_strength > b.edge_strength) ? 1 : ((b.edge_strength > a.edge_strength) ? -1 : 0));

    edges_sort.forEach(function (edge, index) {
        let edge_val_div = edges_validation_div_content.append('div')
            .style('float', 'left')
            .style('position', 'relative')
            .style('width', 'calc(' + 100 + '% - ' + 5 + 'px)')
            .style('height', 60 + 'px')
            .style('margin', 5 + 'px');

        let left_edge_presentation_div = edge_val_div.append('div')
            .style('float', 'left')
            .style('position', 'relative')
            .style('width', 'calc(' + 50 + '% - ' + 10 + 'px)')
            .style('height', 100 + '%')
            .style('margin-right', 10 + 'px');


        const network_repr_information = [{
            value: 'edge_from',
            left: 20,
            left_or_right: 'left'
        }, {
            value: 'edge_to',
            left: 80,
            left_or_right: 'right'
        }];

        let left_svg = left_edge_presentation_div.append('svg')
            .style('width', 100 + '%')
            .style('height', 'calc(' + 100 + '% - 5px)')
            //.style('top', 5 + '%')
            .style('position', 'absolute')
            .style('fill', 'none');

        let circles = [];
        // set background in color of clinical workflow step/group
        network_repr_information.forEach(function (info, index_net) {

            if (index_net === 0) {
                circles = [];
            }
            let div = left_edge_presentation_div.append('div')
                .lower()
                .style('position', 'absolute')
                .style('float', 'left')
                .style('width', 'calc(' + 50 + '% - 5px)')
                .style('height', 'calc(' + 100 + '% - 0px)')
                .style('border-radius', 'var(--div-border-radius)')
                .style(info.left_or_right, 0)
                .style('top', 0)
                .style('background-color', function (d) {
                    if (initial_groups.findIndex(item => item.variables.includes(edge[info.value])) > -1) {
                        return color_clinical_workflow_groups(initial_groups.findIndex(item => item.variables.includes(edge[info.value])) + 1)
                    } else {
                        return 'white';
                    }
                })
                .style('opacity', 0.5)

            const instance = div.node()._tippy
            if (instance) {
                instance.destroy();
            }
            tippy(div.node(), {
                content: initial_groups.filter(item => item.variables.includes(edge[info.value]))[0].label,
                followCursor: true,
            });


            let circle = left_svg.append('circle')
                .attr('class', class_network_circle)
                .attr("r", circle_radius_structure_val)
                .attr("cx", info.left + '%')
                .attr("cy", circle_radius_structure_val + 5 + 'px');


            const instance_circle = circle.node()._tippy
            if (instance_circle) {
                instance_circle.destroy();
            }
            tippy(circle.node(), {
                content: learned_structure_data.nodes.filter(x => x.id === edge[info.value])[0].label,
            });

            circles.push(circle);

            // draw lines
            if (index_net === network_repr_information.length - 1) {

                left_svg.append('path')
                    .attr('class', class_network_paths)
                    .lower()
                    .attr("d", function (d) {
                        let points = [];

                        circles.forEach(function (circ) {
                            points.push({
                                x: parseFloat(circ.node().getBoundingClientRect().x) - circle_radius_structure_val,
                                y: parseFloat(circ.attr("cy"))
                            })
                        })

                        return line(points);

                    })
                    .style('stroke-width', function (d) {
                        return (edge.edge_strength * 10) + 'px'
                    })
            }

            left_svg.append('text')
                .attr('class', class_network_label_text)
                .attr('x', info.left + '%')
                .attr('y', (2 * circle_radius + 10) + 'px')
                .text(learned_structure_data.nodes.filter(x => x.id === edge[info.value])[0].label)
                .style('cursor', 'default')
        })

        let right_edge_presentation_div = edge_val_div.append('div')
            .style('float', 'left')
            .style('position', 'relative')
            .style('width', 'calc(' + 50 + '% - ' + 0 + 'px)')
            .style('height', 100 + '%')
            .style('border-radius', 'var(--div-border-radius)')
            .style('background-color', '#E8E8E8');


        radio_button_inputs.forEach(function (r_input) {
            right_edge_presentation_div.append('input')
                .attr('type', 'radio')
                .attr('name', 'edge_direction' + splitter + edge.edge_from + splitter + edge.edge_to)
                .style('position', 'absolute')
                .style('left', 'calc(' + r_input.left + '% - 9px)')
                .style('top', 'calc(' + 50 + '% - 9px)')
                .attr('value', r_input.value)
                .text(r_input.value)
                .on('change', function (d) {
                    right_edge_presentation_div.style('background-color', '#C0C0C0');

                    let line_triangle = d3.line()
                        .x(function (d) {
                            return d.x;
                        })
                        .y(function (d) {
                            return d.y;
                        });

                    if (this.value === radio_button_inputs[0].value) { //correct

                        add_edge(edge.edge_from, edge.edge_to, edge.edge_strength);
                        remove_edge(edge.edge_to, edge.edge_from);


                    } else if (this.value === radio_button_inputs[1].value) { //wrong

                        remove_edge(edge.edge_from, edge.edge_to);
                        remove_edge(edge.edge_to, edge.edge_from);

                    } else if (this.value === radio_button_inputs[2].value) { //turnaround

                        remove_edge(edge.edge_from, edge.edge_to);
                        add_edge(edge.edge_to, edge.edge_from, edge.edge_strength);

                        left_svg.append('path')
                            .attr('class', 'turnaround')
                            .style('stroke', 'red')//'var(--main-font-color)')
                            .style('stroke-width', 3+'px')
                            .attr("d", function (d) {

                                let points = [];

                                let circles = left_svg.selectAll('circles');
                                circles.each(function (circ) {
                                    points.push({
                                        x: parseFloat(circ.node().getBoundingClientRect().x) - circle_radius_structure_val,
                                        y: parseFloat(circ.attr("cy"))
                                    })
                                })

                                line_triangle(points)
                            })

                    }

                    update_network_views_after_change();

                    function remove_edge (edge_from, edge_to) {
                        learned_structure_data.nodes.find(x => x.id === edge_to).parents =
                            learned_structure_data.nodes.find(x => x.id === edge_to).parents.filter(e => e !== edge_from);

                        learned_structure_data.nodes.find(x => x.id === edge_from).children =
                            learned_structure_data.nodes.find(x => x.id === edge_from).children.filter(e => e !== edge_to);

                        learned_structure_data.edges = learned_structure_data.edges.filter(x => !(x.edge_from === edge_from && x.edge_to === edge_to))
                    }

                    function add_edge (edge_from, edge_to, edge_strength) {

                        if (learned_structure_data.edges.filter(x => (x.edge_from === edge_from && x.edge_to === edge_to)).length === 0) {


                            learned_structure_data.nodes.filter(x => x.id === edge_to)[0].parents.push(edge_from);
                            learned_structure_data.nodes.filter(x => x.id === edge_from)[0].children.push(edge_to);

                            learned_structure_data.edges.push({
                                edge_from: edge_from,
                                edge_to: edge_to,
                                edge_strength: edge_strength
                            });
                        }
                    }
                })
        })
    })
}
