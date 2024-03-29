let initial_groups = [{
    id: lang_id_baseline_characteristics_group,
    label: get_language__label_by_id(lang_id_baseline_characteristics_group),
    variables: []
}, {
    id: lang_id_preoperative_group,
    label: get_language__label_by_id(lang_id_preoperative_group),
    variables: ["Primarytumor", "Cytology"]
}, {
    id: lang_id_biomarkers_group,
    label: get_language__label_by_id(lang_id_biomarkers_group),
    variables: ["CA125","ER","PR","L1CAM","p53", "Pl"]
}, {
    id: lang_id_imaging_group,
    label: get_language__label_by_id(lang_id_imaging_group),
    variables: ["CTMRI", "MI"]
}, {
    id: lang_id_primary_surgical_treatment_group,
    label: get_language__label_by_id(lang_id_primary_surgical_treatment_group),
    variables: []
}, {
    id: lang_id_final_histology_group,
    label: get_language__label_by_id(lang_id_final_histology_group),
    variables: ["LNM","LVSIb", "Histology"]
}, {
    id: lang_id_adjuvant_therapy_group,
    label: get_language__label_by_id(lang_id_adjuvant_therapy_group),
    variables: ["Therapy"]
}, {
    id: lang_id_follow_up_group,
    label: get_language__label_by_id(lang_id_follow_up_group),
    variables: ["X1YR","X3YR","X5YR","Rec"]
}];


let initial_groups_agrigulture = [{
    id: lang_id_agrigulture_controlling_factors_group,
    label: get_language__label_by_id(lang_id_agrigulture_controlling_factors_group),
    variables: ["Soil", "Weather"]
}, {
    id: lang_id_agrigulture_management_interventions_group,
    label: get_language__label_by_id(lang_id_agrigulture_management_interventions_group),
    variables: ["Fungicide_Application", "Water_Application", "Pesticide_Application", "Trash_Burning", "Heat_Treatment", "Fertilizer_Application"]
}, {
    id: lang_id_agrigulture_management_objective_group,
    label: get_language__label_by_id(lang_id_agrigulture_management_objective_group),
    variables: ["Yield"]
}];

if (agriculture_data) initial_groups = initial_groups_agrigulture;
const workflow_group_opacity = 0.5;

function color_cl_workflow_groups (index_group, left_arrow) {
    let color = d3.rgb(color_clinical_workflow_groups(index_group))

    let c = 'rgba('+color.r+',' + color.g+',' + color.b+','+workflow_group_opacity+')';
    if (left_arrow) {
        c = 'rgba('+color.r+',' + color.g+',' + color.b+','+0+')';
    }
    return c;
}

let color_clinical_workflow_groups = d3.scaleSequential().domain([1, 10])
    .interpolator(d3.interpolatePuRd);

let color_subgraphs = d3.scaleSequential().domain([1, 10])
    .interpolator(d3.interpolateRainbow);

let color_distinction_percentage = d3.scaleSequential().domain([0, 100])
    .interpolator(d3.interpolateReds);


function initialize_clinical_workflow_groups(data_inspection_div) {
    let clinical_workflow_group_div = data_inspection_div.append('div').attr('id', id_clinical_workflow_group);

    clinical_workflow_group_div.append('div').attr('class', "add_button");
    clinical_workflow_group_div.append('p').attr('class', 'h2').text(get_language__label_by_id(lang_id_data_groups_workflow));

    d3.select('.' + id_class_add_button).on('click', add_group);

    tippy('.' + id_class_add_button, {
        content: get_language__label_by_id(lang_id_tooltip_add_clinical_workflow_group),
        appendTo: 'parent',
    });

    let clinical_workflow_group_div_sortable = clinical_workflow_group_div.append('div').attr('id', id_clinical_workflow_group_sortable)
        .attr('class', 'js-grid sortable');

    //set color domain again
    color_clinical_workflow_groups.domain([0, initial_groups.length]);

    for (let i = 0; i < initial_groups.length; i++) {

        add_clinical_workflow_step__group(clinical_workflow_group_div_sortable, initial_groups[i]);
    }

    sortable('.sortable')[0].addEventListener('sortupdate', function(e) {

        let groups_updated = [];
        e.detail.destination.items.forEach(function (d) {
            groups_updated.push(initial_groups.filter(x => x.id === d.id)[0]);
        })

        initial_groups = groups_updated;

        update_all_colors_and_text();

        update_group_divs_in_network_view();
        if (learned_structure_data !== null) {
            update_network_view(learned_structure_data, id_network_view, id_network_view_child);
        }
    });
    update_all_colors_and_text();
}


function add_clinical_workflow_step__group(data_inspection_div, group_information) {
    let group_div = data_inspection_div.append('div')
        .attr('class', id_class_clinical_workflow_group)
        .attr('id', group_information.id);

    group_div.on('click', function () {
        select_variables_for_group(group_information);
    })
        .on('mouseover', function () {

            d3.selectAll('.' + id_data_col_div_class).attr('hidden', true);

            initial_groups.filter(x => x.id === group_information.id)[0].variables.forEach(function (d) {

                //d3.select('#' + id_beginning_columns_div + d).style('opacity', '1');
                d3.select('#' + id_beginning_columns_div + d).attr('hidden', null);

            });
        })
        .on('mouseout', function () {
            //d3.selectAll('.' + id_data_col_div_class).style('opacity', 'opacity_when_hidden');
            d3.selectAll('.' + id_data_col_div_class).attr('hidden', null);
        });

    tippy(group_div.node(), {
        content: //'<p>' + get_language__label_by_id(lang_id_show_variables_in_group_only) + '</p>' +
            '<p>' + get_language__label_by_id(lang_id_clicking_on_workflow_step_glyph_to_select) + '</p>',
        allowHTML: true,
        appendTo: 'parent'
    });

    // add right click
    let rightClickableArea = group_div.node();

    const instance = tippy(rightClickableArea, {
        content:
        // '<p onclick="reorder_groups(' + [group_information.id, -1] + ')">' + get_language__label_by_id(lang_id_context_menu_move_left_group) + '</p>' +
        //     '<p onclick="reorder_groups(' + [group_information.id, 1] + ')">' + get_language__label_by_id(lang_id_context_menu_move_right_group) + '</p>' +
             '<p onclick="remove_group(' + group_information.id + ')">' + get_language__label_by_id(lang_id_context_menu_remove_group) + '</p>' +
            '<p onclick="rename_group(' + group_information.id + ')">' + get_language__label_by_id(lang_id_context_menu_rename_group) + '</p>',
        placement: 'right-start',
        trigger: 'manual',
        interactive: true,
        arrow: true,
        offset: [0, 0],
        allowHTML: true,
        appendTo: 'parent'
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

    sortable('.js-grid', {
        forcePlaceholderSize: true,
        placeholderClass: id_class_clinical_workflow_group
    });
}


function add_group(original_id) {

    hide_add_group_view();
    d3.select('.' + id_class_add_clinical_workflow_group_form).style('visibility', 'visible');
    d3.select('#' + id_add_group_button).attr('disabled', 'disabled');

    d3.select('#' + id_group_label_name).on('input', function () {
        if (this.value.length > 0) {
            d3.select('#' + id_add_group_button).attr('disabled', null);
        } else {
            d3.select('#' + id_add_group_button).attr('disabled', 'disabled');
        }
    })
    d3.select('#' + id_add_group_button).on('click', function () {
        let group_name = d3.select('#' + id_group_label_name).node().value;

        if (typeof original_id === 'string') {
            initial_groups.filter(x => x.id === original_id)[0].label = group_name;
        } else {

            let group_obj = {
                id: generate_id_from_text(group_name),
                label: group_name,
                variables: []
            };

            // check if it already exists in groups, if not --> add it
            if (!initial_groups.find(x => x.id === group_obj.id || x.label === group_obj.label)) {

                initial_groups.push(group_obj)
                add_clinical_workflow_step__group(d3.select('#' + id_clinical_workflow_group_sortable), group_obj);
            }
        }
        update_all_colors_and_text();
        update_group_divs_in_network_view(id_network_view_child);

        if (learned_structure_data !== null) {
            update_network_view(learned_structure_data, id_network_view, id_network_view_child);
        }
        hide_add_group_view();

    });
}

function hide_add_group_view() {
    d3.select('#' + id_group_label_name).node().value = "";
    d3.select('.' + id_variable_list_class).selectAll("input").each(function () {
        this.checked = null;
        this.disabled = null;

        d3.select(this.nextElementSibling).style('opacity', 1);

    });
    d3.selectAll('.' + id_class_add_clinical_workflow_group_form).style('visibility', 'hidden');
    d3.selectAll('.' + id_class_select_group_variables).style('visibility', 'hidden');


}

function remove_group(group_id) {

    if (group_id.id !== undefined) {
        group_id = group_id.id;
    }

    initial_groups = initial_groups.filter(function (obj) {
        return obj.id !== group_id;
    });

    d3.select('#' + group_id).remove();
    tippy.hideAll();

    update_all_colors_and_text();
    update_group_divs_in_network_view();

    if (learned_structure_data !== null) {
        update_network_view(learned_structure_data, id_network_view, id_network_view_child);
    }
}

function rename_group(group_id) {
    if (group_id.id !== undefined) {
        group_id = group_id.id;
    }


    tippy.hideAll();

    d3.select('#' + id_group_label_name).node().value = initial_groups.filter(x => x.id === group_id)[0].label;
    add_group(initial_groups.filter(x => x.id === group_id)[0].id);
}

function generate_id_from_text(str) {
    let newString = str.replace(/[^A-Z0-9]/ig, "_");
    return 'id_' + newString;
}

function select_variables_for_group(group_information) {
    hide_add_group_view();


    d3.select('.' + id_class_select_group_variables).style('visibility', 'visible').style('border-color', color_cl_workflow_groups(initial_groups.findIndex(x => x.id === group_information.id) + 1));

    d3.select('#' + id_select_variable_group_name).text(group_information.label);

    let columns = Object.keys(data[0]);

    if (d3.select('.' + id_variable_list_class).selectAll("input").size() === 0) {
        columns.forEach(function (col) {
            let checkbox_div = d3.select('.' + id_variable_list_class).append('div').style('margin', 5 + 'px');
            let checkbox = checkbox_div
                .append('input').attr('type', 'checkbox')
                .attr('id', id_group_selection_ + col)
                .attr('name', id_group_selection_ + col)
                .attr('value', id_group_selection_ + col)
                .style('color', 'black')
                .style('font-size', '16px');

            checkbox_div.append('label')
                .text(col)
                .on('click', function () {

                    if (!checkbox.attr('disabled')) {
                        checkbox.property('checked', function () {
                            return !checkbox.property('checked');

                        })
                    }
                });
        });
    }


    // check all predefined checkboxes
    group_information.variables.forEach(function (d) {
        d3.select('#' + id_group_selection_ + d).node().checked = true; //.property('checked', true);
    });

    // disable checkboxes which are selected within other groups
    initial_groups.filter(x => x.id !== group_information.id).forEach(function (group) {
        group.variables.forEach(function (d) {
            d3.select('#' + id_group_selection_ + d).attr('disabled', true);
            d3.select(d3.select('#' + id_group_selection_ + d).node().nextElementSibling).style('opacity', opacity_when_hidden);
        });
    });

    d3.select('#' + id_submit_group_selection_button).on('click', function () {

        let checked = [];
        let boxes = d3.select('.' + id_variable_list_class).selectAll("input:checked");

        boxes.each(function () {
            checked.push(this.value)
        });

        initial_groups.filter(x => x.id === group_information.id)[0].variables = [];

        for (let i = 0; i < checked.length; i++) {
            initial_groups.filter(x => x.id === group_information.id)[0].variables.push(checked[i].split(id_group_selection_)[1]);
            d3.select('#' + id_beginning_columns_div + checked[i].split(id_group_selection_)[1]).style('border', '6px solid ' + d3.select('#' + group_information.id).style('background-color'));
        }

        update_all_colors_and_text();

        if (learned_structure_data !== null) {
            update_network_view(learned_structure_data, id_network_view, id_network_view_child);
        }

        hide_add_group_view();

        update_variables_order();
    });
}

function update_variables_order () {
    let columns = Object.keys(data[0]);
    columns = columns.sort();

    for (let index_cols = columns.length-1; index_cols > -1; index_cols --) {
        let content = document.getElementById(id_beginning_columns_div + columns[index_cols]);
        let parent = content.parentNode;
        parent.insertBefore(content, parent.firstChild);
    }
    // update_stackedBarChart order of variable divs
    for (let index_groups = initial_groups.length-1; index_groups > -1; index_groups --) {

        let variables = initial_groups[index_groups].variables.sort().reverse();
        let variables_not_available = [];
        variables.forEach(function (variable) {

            let content = document.getElementById(id_beginning_columns_div + variable);
            if (content) {
                let parent = content.parentNode;
                parent.insertBefore(content, parent.firstChild);
            } else {
                variables_not_available.push(variable)
            }
        })

        initial_groups[index_groups].variables = initial_groups[index_groups].variables.filter(x => ! variables_not_available.includes(x));
    }
}

function update_all_colors_and_text() {

    update_group_color_and_text();

    setTimeout(() => {

        d3.selectAll('.' + class_network_paths).filter(function () {

            let splitted_id = this.id.split(splitter);

            if (!this.id.includes('.')) {

                if (splitted_id)
                    if (!d3.select('#' + circle_id + splitted_id[1]).empty() && !d3.select('#' + circle_id + splitted_id[2]).empty()) {
                        return (parseFloat(d3.select('#' + circle_id + splitted_id[1]).style('cx')) > parseFloat(d3.select('#' + circle_id + splitted_id[2]).style('cx')))
                    }
            }
        })
            .style('stroke', 'rgb(255, 0, 0)')
            .style('stroke-width', 6 + 'px');

    }, 3 * transition_duration);
}

function update_group_color_and_text() {
    //set color domain again
    color_clinical_workflow_groups.domain([0, initial_groups.length]);

    initial_groups = initial_groups.filter(x => x !== undefined);
    for (let i = 0; i < initial_groups.length; i++) {
        let group_div = d3.select('#' + initial_groups[i].id);

        group_div.html('<span class="arrow_left"></span>' + initial_groups[i].label + '<span class="arrow_right"></span>')

        // fill with correct color

        group_div.style('background-color', color_cl_workflow_groups(i + 1))
        group_div.select('.arrow_left').style('background-color', color_cl_workflow_groups(i + 1), true);
        group_div.select('.arrow_right').style('border-left-color', color_cl_workflow_groups(i + 1));

        group_div.style('color', get_font_color(color_cl_workflow_groups(i + 1)));

        initial_groups[i].variables.forEach(function (variable) {
            d3.select('#' + id_beginning_columns_div + variable).style('border', '6px solid ' + color_cl_workflow_groups(i + 1));
        })
    }
}