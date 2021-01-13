
function select_variable_for_validation () {
    let unvalidated_nodes = learned_structure_data.nodes.filter(x => x.structure_validated === false);
    let node_under_investigation = unvalidated_nodes[0];

    let node_validation_network_structure = {
        edges: [],
        nodes: []
    };

    node_validation_network_structure.nodes = learned_structure_data.nodes.filter(x =>
        node_under_investigation.parents.includes(x.id) ||
        node_under_investigation.children.includes(x.id) ||
        x.id === node_under_investigation.id
    );


    node_validation_network_structure.edges.push({
        edge_from: node_under_investigation.id,
        edge_to: node_under_investigation.children
    })

    node_under_investigation.parents.forEach(function (parent) {
        node_validation_network_structure.edges.push({
            edge_from: parent,
            edge_to: [node_under_investigation.id]
        })
    })

    initialize_network_view(structure_validation_viewer_div, 80, false, node_validation_network_structure, 'structure_validation_viewer_div_child');

    setTimeout(() => {
        update_network_views_node_for_validation(node_under_investigation);
        update_network_overview_for_validated_nodes();
        initialize_steps(node_under_investigation);

    }, transition_duration + 10);
}