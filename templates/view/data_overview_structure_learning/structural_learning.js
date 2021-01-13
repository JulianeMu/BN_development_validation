function initialize_structural_learning_view(structure_learning_div) {
    structure_learning_div.append('p').attr('class', 'h2')
        .text(get_language__label_by_id(lang_id_heading_data_driven_structure));

    const network_view_height = 700;
    // Set up an SVG group so that we can translate the final graph.
    structure_learning_div
        .append('div').attr('id', id_network_view)
        .style('width', '100%')
        .style('height', network_view_height + 'px')
        .style('background-color', 'white')
        .style('border-radius', 'var(--div-border-radius)');


    initialize_network_view(id_network_view, 100, true, learned_structure_data, id_network_view_child);


}



