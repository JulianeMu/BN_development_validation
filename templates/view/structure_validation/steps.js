function initialize_steps () {

    const steps = [lang_id_variable_type, lang_id_variable_identifier, lang_id_variable_states, lang_id_variable_parents];


    let steps_div_list = d3.select('#' + steps_structure_validation_div).append('ol');

    steps.forEach(function (d, i) {
        let step = steps_div_list
            .append('li')
            .text(get_language__label_by_id(d))
            .style('font-weight', 500)
            .style('color', 'var(--main-font-color)')
            .style('padding-top', 5 + 'px');

        if (i>0) {
            step.style('opacity', 0.4);
        }
    })
}