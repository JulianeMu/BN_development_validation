
let initial_groups = [{
    id: lang_id_demographic_group,
    text: get_language__label_by_id(lang_id_demographic_group)
}, {
    id: lang_id_biomarkers_group,
    text: get_language__label_by_id(lang_id_biomarkers_group)
}, {
    id: lang_id_preoperative_group,
    text: get_language__label_by_id(lang_id_preoperative_group)
}, {
    id: lang_id_postoperative_group,
    text: get_language__label_by_id(lang_id_postoperative_group)
}];

let color_clinical_workflow_groups = d3.scaleOrdinal(d3.schemeCategory10)
    //d3.scaleSequential().domain([1,10])
    //.interpolator(d3.interpolatePuRd);


function initialize_clinical_workflow_groups (data_inspection_div) {
    let clinical_workflow_group_div = data_inspection_div.append('div').attr('id', id_clinical_workflow_group);

    clinical_workflow_group_div.append('div').attr('class',"add_button");
    clinical_workflow_group_div.append('p').attr('class', 'h2').text(get_language__label_by_id(lang_id_data_groups_workflow));

    d3.select('.' + id_class_add_button).on('click', function () {
        console.log('abc');
    });

    tippy('.' + id_class_add_button, {
        content: get_language__label_by_id(lang_id_tooltip_add_clinical_workflow_group),
    });

    //set color domain again
    color_clinical_workflow_groups.domain([0,initial_groups.length]);

    for (let i = 0; i< initial_groups.length; i++) {

        add_clinical_workflow_step__group(clinical_workflow_group_div, initial_groups[i], color_clinical_workflow_groups(i+1));
    }

    update_group_color_and_text();
}

function add_clinical_workflow_step__group (data_inspection_div, group_information, color) {
    let group_div = data_inspection_div.append('div').attr('class', id_class_clinical_workflow_group).attr('id', group_information.id);

    group_div.on('click', function (d) {
        console.log(group_information);
    })


    // add right click
    let rightClickableArea = group_div.node();

    const instance = tippy(rightClickableArea, {
        content: '<p onclick="reorder_groups(' + [group_information.id, -1]+ ')">' + get_language__label_by_id(lang_id_context_menu_move_left_group) + '</p>' +
            '<p onclick="reorder_groups(' + [group_information.id, 1]+ ')">' + get_language__label_by_id(lang_id_context_menu_move_right_group) + '</p>' +
            '<p onclick="remove_group(' +group_information.id+ ')">' + get_language__label_by_id(lang_id_context_menu_remove_group) + '</p>' +
            '<p onclick="rename_group(' +group_information.id+ ')">' + get_language__label_by_id(lang_id_context_menu_rename_group) + '</p>',
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

function get_font_color(color) {
    // in case the luminance is bright, use black font color, otherwise white
    let d3color = d3.color(color);
    let luminance = 0.2126*d3color.r + 0.7152*d3color.g + 0.0722*d3color.b;

    let font_color = 'white';
    if (luminance > 150) {
        font_color= 'black';
    }

    return font_color;

}

function remove_group(group_id) {

    initial_groups = initial_groups.filter(function (obj) {
        return obj.id !== group_id;
    });

    d3.select('#' + group_id).remove();
    tippy.hideAll();

    update_group_color_and_text();
}

function rename_group(group_id) {
    console.log('rename')
    console.log(group_id)
    tippy.hideAll();

    update_group_color_and_text();
}

function reorder_groups(group_id, direction) {

    let current_pos = initial_groups.findIndex(x => x.id === group_id);

    if ((current_pos> 0 && direction <0) || (current_pos< initial_groups.length-1 && direction>0)) {
        let a = initial_groups[current_pos], b = initial_groups[current_pos + direction];
        initial_groups[current_pos + direction] = a;
        initial_groups[current_pos] = b;

        if (direction> 0) {
            d3.select('#' + group_id).node().parentNode.insertBefore(d3.select('#' + initial_groups[current_pos].id).node(), d3.select('#' + initial_groups[current_pos+ direction].id).node());

        } else {
            d3.select('#' + group_id).node().parentNode.insertBefore(d3.select('#' + initial_groups[current_pos+ direction].id).node(), d3.select('#' + initial_groups[current_pos].id).node());
        }
    }

    tippy.hideAll();
}


function update_group_color_and_text () {
    //set color domain again
    color_clinical_workflow_groups.domain([0,initial_groups.length]);

    for(let i=0; i< initial_groups.length; i++) {
        let group_div = d3.select('#' + initial_groups[i].id);

        group_div.html('<span class="arrow_left"></span>' + initial_groups[i].text + '<span class="arrow_right"></span>')

        // fill with correct color
        group_div.style('background-color', color_clinical_workflow_groups(i+1))
        group_div.select('.arrow_left').style('background-color', color_clinical_workflow_groups(i+1));
        group_div.select('.arrow_right').style('border-left-color', color_clinical_workflow_groups(i+1));

        group_div.style('color', get_font_color(color_clinical_workflow_groups(i+1)));
    }
}