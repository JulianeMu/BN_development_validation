function add_clinical_workflow_step__group (data_inspection_div, lang_id, color) {
    let group_div = data_inspection_div.append('div').attr('class', id_class_clinical_workflow_group).attr('id', lang_id)
        .html('<span class="arrow_left"></span>' + get_language__label_by_id(lang_id) + '<span class="arrow_right"></span>')
        .style('background-color', color);

    group_div.select('.arrow_left').style('background-color', color);
    group_div.select('.arrow_right').style('border-left-color', color);

    // in case the luminance is bright, use black font color, otherwise white
    let d3color = d3.color(color);
    let luminance = 0.2126*d3color.r + 0.7152*d3color.g + 0.0722*d3color.b;

    if (luminance > 150) {
        group_div.style('color', 'black');
    } else {
        group_div.style('color', 'white');
    }
}