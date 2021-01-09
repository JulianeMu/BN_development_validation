const splitter_prior_knowledge= '__to__';

function initialize_prior_knowledge_view (structure_learning_div) {
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
                    .attr('id', array_selection[from_to[0]] + splitter_prior_knowledge +  array_selection[from_to[1]])
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
                initialize_network_view(response);
            })
        });

    structure_learning_div.append('div')
        .attr('id', id_whitelist_blacklist_divs);
}

function remove_blacklist_or_whitelist (group_id) {
    [from_blackwhite, to_blackwhite] = group_id.id.split(splitter_prior_knowledge);

    blacklist = blacklist.filter(x => x.from !== from_blackwhite && x.to !== to_blackwhite);
    whitelist = whitelist.filter(x => x.from !== from_blackwhite && x.to !== to_blackwhite);

    group_id.remove();

    tippy.hideAll();
}