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
        .style('border-radius', 6 + 'px');
    //.style('margin', 10+'px');


    for (let i = 0; i < initial_groups.length; i++) {
        d3.select('#' + id_network_view)//.select('svg')
            .append('div')
            .attr('id', id_class_groups_in_network_view + initial_groups[i].id)
            .style('width', (document.getElementById(id_network_view).getBoundingClientRect().width - 20) + 'px')
            .style('height', 0 + 'px')
            .style('position', 'relative')
            .style('float', 'left')
            .style('opacity', 0.5)
            //.style('margin-top', 10+'px')
            //.style('margin-left', 10+'px')
            .style('background-color', color_clinical_workflow_groups(initial_groups.findIndex(x => x.id === initial_groups[i].id) + 1))
            .style('border-radius', 6 + 'px');
    }

    d3.select('#' + id_network_view)
        .append("svg")
        .style('width', (parseFloat(d3.select('#' + id_network_view).node().getBoundingClientRect().width) - 2* 15) + 'px')
        .style('height', (d3.select('#' + id_network_view).node().getBoundingClientRect().height - 2 * 15) + 'px')
        .style('padding', 15 + 'px')
        .style('left', '0')
        .style('y', '0')
        .style('position', 'absolute')
        .append("g")
        .style('left', 0)
        .style('top', 0);
}


function get_workflow_step_group(variable_id) {
    let group = initial_groups.filter(x => x.variables.includes(variable_id));
    if(group.length > 0) {
        return(group[0].id);
    }
    return null;
}





