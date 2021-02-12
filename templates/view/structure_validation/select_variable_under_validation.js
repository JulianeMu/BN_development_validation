
let investigation_node_index = 0;

function select_variable_for_validation () {

    let node_under_investigation = learned_structure_data.nodes[investigation_node_index];

    let node_validation_network_structure = {
        edges: [],
        nodes: []
    };

    node_validation_network_structure.nodes = learned_structure_data.nodes.filter(x =>
        node_under_investigation.parents.includes(x.id) ||
        node_under_investigation.children.includes(x.id) ||
        x.id === node_under_investigation.id
    );


    node_validation_network_structure.edges = learned_structure_data.edges.filter(x => x.edge_from === node_under_investigation.id || x.edge_to === node_under_investigation.id);

    return [node_validation_network_structure, node_under_investigation];

}

function initialize_network_views_after_node_under_investigation_comp(node_validation_network_structure, node_under_investigation) {
    initialize_network_view(structure_validation_viewer_div, 80, false, node_validation_network_structure, 'structure_validation_viewer_div_child');

    setTimeout(() => {
        initialize_structure_validation_steps(node_under_investigation);
        update_network_overview_for_validated_nodes();

        update_network_views_node_for_validation(node_under_investigation);

    }, transition_duration + 10);
}