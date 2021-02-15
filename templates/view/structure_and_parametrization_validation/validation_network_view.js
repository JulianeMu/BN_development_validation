function update_network_views_node_for_validation(node_under_investigation) {

    setTimeout(() => {
        d3.selectAll('#' + circle_id + node_under_investigation.id).style('stroke', 'var(--highlight_color)');
        node_under_investigation.children.forEach(function (child) {

            if (!learned_structure_data.nodes.find(x => x.id === child).structure_validated)
                d3.select('#' + structure_validation_viewer_div_child).select('#' + circle_id + child).style('fill', 'grey');//.style('opacity', 0.5);
            d3.select('#' + structure_validation_viewer_div_child).selectAll('path').filter(function () {
                return this.id.split(splitter).includes(child) && d3.select(this).style('stroke') !== 'rgb(255, 0, 0)';
            }).transition().duration(transition_duration / 2).style('stroke', 'grey')//.style('opacity', 0.5);
        })
    }, transition_duration + 10);
}

function update_network_overview_for_validated_nodes() {

    setTimeout(() => {

        learned_structure_data.nodes.forEach(function (node) {
            if (!node.structure_validated) {
                d3.select('#' + id_network_view_child).select('#' + circle_id + node.id).style('fill', 'grey');
                d3.select('#' + id_network_view_child).selectAll('path').filter(function () {
                    return this.id.split(splitter).includes(node.id) && d3.select(this).style('stroke') !== 'rgb(255, 0, 0)';
                }).transition().duration(transition_duration / 2).style('stroke', 'grey');
            }
        })

        d3.selectAll('.' + class_network_circle).on('click', function (d) {

            investigation_node_index = learned_structure_data.nodes.map(e => e.id).indexOf(this.id.split(circle_id)[1]);
            [node_validation_network_structure, node_under_investigation] = select_variable_for_validation();

            update_network_views_after_change(node_validation_network_structure, node_under_investigation);

            if (!structure_or_parametrization) {
                initialize_structure_validation_steps(node_under_investigation);
            } else {
                let input = transform_data_for_stackedBarChart(node_under_investigation);
                update_stackedBarChart(input, 0, node_under_investigation);
            }

            setTimeout(() => {
                update_network_overview_for_validated_nodes();

                update_network_views_node_for_validation(node_under_investigation);

            }, transition_duration + 10);

        })
    }, transition_duration + 10);
}