
function update_network_views_node_for_validation (node_under_investigation) {

    d3.selectAll('#' + circle_id + node_under_investigation.id).style('stroke', 'var(--highlight_color)');
    node_under_investigation.children.forEach(function (child) {
        d3.select('#' + structure_validation_viewer_div_child).select('#' + circle_id + child).style('opacity', 0.5);
        d3.select('#' + structure_validation_viewer_div_child).selectAll('path').filter(function () {
            return this.id.split(splitter).includes(child);
        }).transition().duration(transition_duration / 2).style('opacity', 0.5);
    })
}

function update_network_overview_for_validated_nodes () {

    learned_structure_data.nodes.forEach(function (node) {
        if (!node.structure_validated) {
            d3.select('#' + id_network_view_child).select('#' + circle_id + node.id).style('fill', 'grey');
            d3.select('#' + id_network_view_child).selectAll('path').filter(function () {
                return this.id.split(splitter).includes(node.id);
            }).transition().duration(transition_duration / 2).style('stroke', 'grey');


        }
    })

    d3.selectAll('.' + class_network_circle).on('click', function (d) {

        investigation_node_index = learned_structure_data.nodes.map(e => e.id).indexOf(this.id.split(circle_id)[1]);
        [node_validation_network_structure, node_under_investigation] = select_variable_for_validation();

        update_network_views_after_change(node_validation_network_structure, node_under_investigation);

        update_network_views_node_for_validation(node_under_investigation);
        update_network_overview_for_validated_nodes();
        initialize_steps(node_under_investigation);
    })
}