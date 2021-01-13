function initialize_steps (node_under_investigation) {

    d3.select('#' + steps_structure_validation_div).selectAll('*').remove();
    const steps = [lang_id_variable_type, lang_id_variable_identifier, lang_id_variable_states, lang_id_variable_parents];

    const data_types = [lang_id_structure_validation_data_type_personal_data, lang_id_structure_validation_data_type_anomalies, lang_id_structure_validation_data_type_examination_data, lang_id_structure_validation_data_type_deterministic_decisions];

    append_selection(lang_id_variable_type, data_types, 'data_type');

    append_text_input(lang_id_variable_identifier, node_under_investigation.label, 'label');


    function append_text_input (lang_id, label, node_prop) {

        let selection_div = d3.select('#' + steps_structure_validation_div).append('div')
            .style('width', 100 + '%')
            .style('position', 'relative')
            .style('float', 'left')
            .style('padding-top', 20+'px')
            .append('label')
            .text(get_language__label_by_id(lang_id))
            .append('input')
            .style('margin', 'var(--padding)')
            .style('width', parseFloat(d3.select('.fstdiv').style('width'))-20 + 'px')//'calc(' + 100+'% - 5*var(--padding))')
            .attr('type', 'text')
            .attr('value',label);

        selection_div.on('change', function (d) {
            node_under_investigation[node_prop] = this.value;
            learned_structure_data.nodes.filter(x => x.id === node_under_investigation.id)[0][node_prop] = this.value;
            update_network_views_after_change();
        })
    }


    function append_selection(lang_id, data_types, node_prop) {
        let selection_div = d3.select('#' + steps_structure_validation_div).append('div')
            .style('width', 100 + '%')
            .style('position', 'relative')
            .style('float', 'left')
            .append('label')
            .text(get_language__label_by_id(lang_id))
            .append('select')
            .attr('class', 'fstdropdown-select')
            .attr('id', lang_id)

        setFstDropdown(); // this needs to be set to have it as a FstDropdown
        selection_div.append('option').attr('value', "").text('Select option');

        let select = selection_div.node();

        data_types.forEach(function (data_type) {
            let opt = document.createElement("option");
            opt.text = get_language__label_by_id(data_type);
            opt.value = data_type;
            opt.id = steps_structure_validation_div

            select.add(opt);
        });

        document.querySelector("#" + lang_id).fstdropdown.rebind();

        d3.select(select).on('change', function (d) {
            learned_structure_data.nodes.filter(x => x.id === node_under_investigation.id)[0][node_prop] = this.value
            update_network_views_after_change();
        })

        d3.select('.fstselected').style('color', '#444168')
            .style('font-weight', '400')
            .style('font-size', 16+'px')
            .style('border-radius', 6+'px')
    }
}


function update_network_views_after_change () {
    update_network_view(learned_structure_data, id_network_view, id_network_view_child);
    [node_validation_network_structure, node_under_investigation] = select_variable_for_validation();

    update_network_view(node_validation_network_structure, structure_validation_viewer_div, 'structure_validation_viewer_div_child');
}
