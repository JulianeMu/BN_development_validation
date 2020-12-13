const opacity_when_hidden = 0.6;
const splitter= '__to__';

let integrate_white_list_black_list = id_whitelist_button;

function initialize_inspect_data_learn_model_view() {

    let content_div = d3.select('#' + id_main_content).select('.' + id_content);

    initialize_data_inspection_view(content_div);
    initialize_model_learning_view(content_div);
}

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

    columns.forEach(function (col) {
        let div = data_variables_div.append('div')
            .attr('class', 'data_col_div')
            .attr('id', id_beginning_columns_div + col);

        div.on('click', function (d) {
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

function initialize_model_learning_view(content_div) {

    let structure_learning_div = content_div.append('div')
        .attr('id', id_learnt_model_div)
        .style('padding-top', 20 + 'px')
        .style('padding-bottom', 20 + 'px');


    whitelist_blacklist_buttons.forEach(function (button_div, index) {
        d3.select('#' + button_div).on('click', function () {
            d3.select('#' + button_div).style('opacity', 1);
            d3.select('#' + whitelist_blacklist_buttons[whitelist_blacklist_buttons.length - index - 1]).style('opacity', opacity_when_hidden);

            integrate_white_list_black_list = button_div;
        });

        if (index === 0) {
            d3.select('#' + whitelist_blacklist_buttons[whitelist_blacklist_buttons.length - index - 1]).style('opacity', opacity_when_hidden);
        }
    })


    let columns = Object.keys(data[0]);


    id_whitelist_blacklist_from_to.forEach(function (blacklist_whitelist_select_div_id) {
        let select = document.getElementById(blacklist_whitelist_select_div_id);

        columns.forEach(function (col) {
            var opt = document.createElement("option");
            opt.text = opt.value = col;
            opt.id = blacklist_whitelist_select_div_id + 'col'
            select.add(opt);
        });

        document.querySelector("#" + blacklist_whitelist_select_div_id).fstdropdown.rebind()

        const from_to = ['from', 'to'];

        d3.select(select).on('change', function (d) {
            let array_selection = {};
            id_whitelist_blacklist_from_to.forEach(function (blacklist_whitelist_select_div_id, i) {
                array_selection[from_to[i]] = document.getElementById(blacklist_whitelist_select_div_id).value
            });


            let found = Object.keys(array_selection).filter(function (key) {
                return array_selection[key] === "";
            });

            let found_in_blacklist = blacklist.find(x => x.from === array_selection.from && x.to === array_selection.to);
            let found_in_whitelist = whitelist.find(x => x.from === array_selection.from && x.to === array_selection.to);

            if (found_in_blacklist) {

                tippy_selectionlist_to.setContent("This prior knowledge was already added to the blacklist.");
                tippy_selectionlist_to.show();

            } else if (found_in_whitelist) {
                tippy_selectionlist_to.setContent("This prior knowledge was already added to the whitelist.");
                tippy_selectionlist_to.show();

            } else if (array_selection[from_to[0]] === array_selection[from_to[1]]) {
                tippy_selectionlist_to.setContent("The 'from' value cannot be the same as the 'to' value.");
                tippy_selectionlist_to.show();

            } else if (found.length > 0) {
                tippy_selectionlist_to.setContent("Please select the from and to variables for blacklist/whitelist.");
                tippy_selectionlist_to.show();

            } else {

                id_whitelist_blacklist_from_to.forEach(function (blacklist_whitelist_select_div_id) {
                    document.getElementById(blacklist_whitelist_select_div_id).value = "";
                    document.getElementById(blacklist_whitelist_select_div_id).fstdropdown.rebind();
                });

                let blacklist_or_whitelist = whitelist;
                let blacklist_or_whitelist_class = id_whitelist_list_divs;

                if (integrate_white_list_black_list === id_blacklist_button) {
                    blacklist_or_whitelist = blacklist;
                    blacklist_or_whitelist_class = id_blacklist_list_divs;
                }

                blacklist_or_whitelist.push(array_selection);
                let black_whitelist_divs_in_view = d3.select('#' + id_whitelist_blacklist_divs).append('div')
                    .attr('id', array_selection[from_to[0]] + splitter +  array_selection[from_to[1]])
                    .attr('class', blacklist_or_whitelist_class)
                    .style('margin-top', 5 + 'px');
                black_whitelist_divs_in_view.append('p')
                    .style('margin', 0)
                    .text('from ' + array_selection[from_to[0]] + ' to ' + array_selection[from_to[1]]);

                let rightClickableArea = black_whitelist_divs_in_view.node();

                const instance = tippy(rightClickableArea, {
                    content: '<p onclick="remove_blacklist_or_whitelist(' + rightClickableArea.id + ')">' + get_language__label_by_id(lang_id_context_menu_remove_group) + '</p>',
                    placement: 'right-start',
                    trigger: 'manual',
                    interactive: true,
                    arrow: true,
                    offset: [0, 0],
                    allowHTML: true,
                });

                rightClickableArea.addEventListener('contextmenu', (event) => {
                    event.preventDefault();

                    instance.setProps({
                        getReferenceClientRect: () => ({
                            width: 0,
                            height: 0,
                            top: event.clientY,
                            bottom: event.clientY,
                            left: event.clientX,
                            right: event.clientX,
                        }),
                    });

                    instance.show();
                });
            }
        })
    })


    let tippy_selectionlist_to = tippy(d3.select('#' + id_whitelist_blacklist_to + '_div').node(), {
        content: "Please select the from and to variables for blacklist/whitelist.",
    });

    structure_learning_div.append('input').attr('class', 'button')
        .attr('value', get_language__label_by_id(lang_id_include_preknowledge))
        .style('position', 'relative')
        .style('width', 320 + 'px')
        .on('click', function (d) {
            d3.select('#select_blacklist_whitelist')
                .style('width', 570 + 'px')
                .style('left', 'calc(50% - 285px)')
                .style('visibility', 'visible');
        });

    structure_learning_div.append('input').attr('class', 'button')
        .style('right', 10 + 'px')
        .attr('value', get_language__label_by_id(lang_id_learn_structure))
        .on('click', function (d) {
            learn_structure_from_data(function (response) {
                console.log(response);
            })
        });

    structure_learning_div.append('div')
        .attr('id', id_whitelist_blacklist_divs);


    structure_learning_div.append('p').attr('class', 'h2')
        .text(get_language__label_by_id(lang_id_heading_data_driven_structure));

}

function remove_blacklist_or_whitelist (group_id) {
    [from_blackwhite, to_blackwhite] = group_id.id.split(splitter);

    blacklist = blacklist.filter(x => x.from !== from_blackwhite && x.to !== to_blackwhite);
    whitelist = whitelist.filter(x => x.from !== from_blackwhite && x.to !== to_blackwhite);

    group_id.remove();
}

