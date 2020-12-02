function initialize_inspect_data_learn_model() {
    let content_div = d3.select('#' + id_main_content).select('.' + id_content).append('div')
        .attr('id', id_data_inspection_div)
        .style('width', 100 + '%')
        .style('height', 100 + 'vh');

    content_div.append('p').attr('class', 'h2').text(get_language__label_by_id(lang_id_data_overview));

    query_data_from_FLASK(function (data) {
        console.log(data)
    });
}

