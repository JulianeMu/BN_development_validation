function initialize_inspect_data_learn_model() {
    let content_div = d3.select('#' + id_main_content).select('.' + id_content).append('div')
        .attr('id', id_data_inspection_div)
        .style('width', 100 + '%')
        .style('height', 100 + 'vh');

    content_div.append('p').attr('class', 'h2').text(get_language__label_by_id(lang_id_data_overview));

    query_data_from_FLASK(function (data) {
        console.log(data)

        let columns = Object.keys(data[0]);
        console.log(columns);

        columns.forEach(function (col) {
            content_div.append('div').attr('class', 'data_col_div');
        })

        let abc = extractColumn(data, columns[0]);
        console.log(abc)

        const map = abc.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map());

        console.info([...map.entries()]) // to get the pairs [element, frequency]

        function extractColumn(arr, column) {
            return arr.map(x => x[column])
        }
    });
}

