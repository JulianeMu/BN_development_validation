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


    const space_left = 100;
    const padding = 15;

    d3.select('#' + id_network_view)
        .append('div')
        .attr('id', id_network_view_child)
        .style('position', 'absolute')
        .style('width', 'calc(100% - 2*' + padding + 'px)')
        .style('height', (parseFloat(d3.select('#' + id_network_view).style('height')) - 2* padding) + 'px')
        .style('padding', padding + 'px')
        .style('overflow-y', 'scroll')
        .style('overflow-x', 'scroll')
        .append("svg")
        .style('width', 'calc(100%-' + space_left + 'px)')
        .style('height', '90%')
        .style('left', space_left + 'px')
        .style('position', 'absolute')
        .style('fill', 'none');

    update_group_divs_in_network_view();

}


function get_workflow_step_group(variable_id) {
    let group = initial_groups.filter(x => x.variables.includes(variable_id));
    if(group.length > 0) {
        return(group[0].id);
    }
    return null;
}

function update_group_divs_in_network_view () {
    d3.select('#' + id_network_view_child).selectAll('.' + id_class_groups_in_network_view).remove();

    for (let i = initial_groups.length-1; i >-1; i--) {

        let group_div = d3.select('#' + id_network_view_child)
            .append('div')
            .lower()
            .attr('class', id_class_groups_in_network_view)
            .attr('id', id_class_groups_in_network_view + initial_groups[i].id)
            .style('width', 100+'%')
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
            .style('padding-left', 5+'px')
            .style('opacity', 0);

        tippy(group_div.node(), {
            content: initial_groups[i].label,
            placement: "top-start",
            appendTo: 'parent',
        });
    }
}

