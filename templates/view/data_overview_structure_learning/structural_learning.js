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

    update_group_divs_in_network_view();

    const padding_left = 100;
    const padding = 15;

    d3.select('#' + id_network_view)
        .style('overflow-y', 'scroll')
        .append("svg")
        .style('width', (parseFloat(d3.select('#' + id_network_view).node().getBoundingClientRect().width) - padding_left - 2*padding) + 'px')
        .style('height', (d3.select('#' + id_network_view).node().getBoundingClientRect().height - 2 * padding) + 'px')
        //.style('height', 1000 + 'px')
        .style('padding', padding + 'px')
        //.style('padding-left', padding_left + 'px')
        .style('left', padding_left)
        .style('y', '0')
        .style('fill', 'none')
        .style('position', 'absolute')
        .style('overflow-y', 'scroll')
        .append("g")
        .style('fill', 'none')
        .style('left', 0)
        .style('top', 0)
        .style('overflow-y', 'scroll')
}


function get_workflow_step_group(variable_id) {
    let group = initial_groups.filter(x => x.variables.includes(variable_id));
    if(group.length > 0) {
        return(group[0].id);
    }
    return null;
}

function update_group_divs_in_network_view () {
    d3.select('#' + id_network_view).selectAll('.' + id_class_groups_in_network_view).remove();

    for (let i = initial_groups.length-1; i >-1; i--) {

        let group_div = d3.select('#' + id_network_view)//.select('svg')
            .append('div')
            .lower()
            .attr('class', id_class_groups_in_network_view)
            .attr('id', id_class_groups_in_network_view + initial_groups[i].id)
            .style('width', (document.getElementById(id_network_view).getBoundingClientRect().width - 20) + 'px')
            .style('height', 0 + 'px')
            .style('position', 'relative')
            .style('float', 'left')
            .style('opacity', 0.5)
            .style('background-color', color_clinical_workflow_groups(initial_groups.findIndex(x => x.id === initial_groups[i].id) + 1))
            .style('border-radius', 6 + 'px')
            .append('p').attr('class', 'network_group_label')
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
            placement: "top-start"
        });
    }
}

