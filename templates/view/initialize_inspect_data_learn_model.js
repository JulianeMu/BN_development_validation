function initialize_inspect_data_learn_model_view(data) {
    let content_div = d3.select('#' + id_main_content).select('.' + id_content).append('div')
        .attr('id', id_data_inspection_div)
        .style('width', 100 + '%')
        .style('height', 100 + 'vh');

    content_div.append('p').attr('class', 'h2').text(get_language__label_by_id(lang_id_data_overview));


    let columns = Object.keys(data[0]);

    columns.forEach(function (col) {
        let div = content_div.append('div').attr('class', 'data_col_div').attr('id', id_beginning_columns_div + col);
        div.append('p').text(col).attr('class', 'text_no_margin');

        let extracted_data = extractColumn(data, col);

        const map = extracted_data.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map());

        function extractColumn(arr, column) {
            return arr.map(x => x[column])
        }

        append_horizontal_bar_chart(id_beginning_columns_div + col, [...map.entries()], data.length);
    })
}

