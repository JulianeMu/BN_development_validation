function initialize_steps (node_under_investigation) {

    d3.select('#' + steps_structure_validation_div).selectAll('*').remove();
    const steps = [lang_id_variable_type, lang_id_variable_identifier, lang_id_variable_states, lang_id_variable_parents];

    const data_types = [lang_id_structure_validation_data_type_personal_data, lang_id_structure_validation_data_type_anomalies, lang_id_structure_validation_data_type_examination_data, lang_id_structure_validation_data_type_deterministic_decisions];

    let selection_div = d3.select('#' + steps_structure_validation_div).append('div')
        .style('width', 100 + '%')
        .style('position', 'relative')
        .style('float', 'left')
        .append('label')
        .text(get_language__label_by_id(lang_id_variable_type))
        .append('select')
        .attr('class', 'fstdropdown-select')
        .attr('id', lang_id_variable_type)

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

    document.querySelector("#" + lang_id_variable_type).fstdropdown.rebind();

    d3.select(select).on('change', function (d) {
        learned_structure_data.nodes.filter(x => x.id === node_under_investigation.id)[0].data_type = this.value
    })



}