function initialize_data_inspection_view(content_div) {
    let data_inspection_div = content_div.append('div')
        .attr('id', id_data_inspection_div);

    initialize_clinical_workflow_groups(data_inspection_div);

    let data_inspection_div_all = data_inspection_div.append('div').attr('class', 'id_data_inspection_all');

    data_inspection_div_all.append('p').attr('class', 'h2')
        .style('width', 50 + '%')
        .style('float', 'left')
        .text(get_language__label_by_id(lang_id_data_overview));

    data_inspection_div_all.append('p').attr('class', 'h2')
        .style('width', 50 + '%')
        .style('float', 'right')
        .style('text-align', 'right')
        .text(get_language__label_by_id(lang_id_number_of_patients) + ' ' + data.length);


    let data_variables_div = data_inspection_div_all.append('div').attr('class', id_data_variables_view_class)

    let columns = Object.keys(data[0]);

    columns = columns.sort();
    columns.forEach(function (col) {
        let div = data_variables_div.append('div')
            .attr('class', 'data_col_div')
            .attr('id', id_beginning_columns_div + col);

        div.on('click', function () {
            subset_selection.find(x => x.id === col).included_in_structural_learning = !subset_selection.find(x => x.id === col).included_in_structural_learning;

            if (subset_selection.find(x => x.id === col).included_in_structural_learning) {
                this.style.opacity = 1;
            } else {
                this.style.opacity = opacity_when_hidden;
            }
        })

        div.append('p').text(col).attr('class', 'text_no_margin');//.style('background-color', 'red');

        let extracted_data = extractColumn(data, col);

        const map = extracted_data.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map());

        function extractColumn(arr, column) {
            return arr.map(x => x[column])
        }

        append_horizontal_bar_chart(id_beginning_columns_div + col, [...map.entries()], data.length);

        append_missing_values_chart(id_beginning_columns_div + col, extracted_data);

        if (subset_selection.find(x => x.id === col).included_in_structural_learning) {
            div.style('opacity', 1);
        } else {
            div.style('opacity', opacity_when_hidden);
        }

        tippy(div.node(), {
            content: get_language__label_by_id(lang_id_tooltip_click_to_select),
            appendTo: 'parent',
        });
    })
}

function append_missing_values_chart(div_id, col) {

    let svg = d3.select('#' + div_id).append("svg")
        .style('position', 'absolute')
        .attr("width", 'calc(20px - 5px)')
        .attr("height", 'calc(100% - 10px)')
        .style('margin', 5 + 'px')
        .style('top', 0);

    svg.append('rect')
        .style('width', 100 + '%')
        .style('height', 100 + '%')
        .attr('fill', 'white')
        .style('stroke', 'var(--main-font-color)')
        .style('stroke-width', '3px')
        .attr("rx", 16)
        .attr("ry", 16)

    let number_missing = col.filter(x => x !== "" && x !== undefined && x !== null).length;

    let percentage_available = (number_missing * 100) / col.length;

    svg.append('rect')
        .style('width', 100 + '%')
        .style('height', percentage_available + '%')
        .attr("y", (100 - percentage_available) + '%')
        .attr('fill', 'var(--main-font-color)')
        .attr("rx", 16)
        .attr("ry", 16)

    tippy(svg.selectAll('rect').nodes(), {
        content: get_language__label_by_id(lang_id_available_data) + percentage_available.toFixed(1) + '%',
    });
}