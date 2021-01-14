function initialize_steps (node_under_investigation) {

    d3.select('#' + steps_structure_validation_div).selectAll('*').remove();
    const steps = [lang_id_variable_type, lang_id_variable_identifier, lang_id_variable_states, lang_id_variable_parents];


    append_text_input(lang_id_variable_identifier, node_under_investigation.label, 'label');

    const data_types = [lang_id_structure_validation_data_type_personal_data, lang_id_structure_validation_data_type_anomalies, lang_id_structure_validation_data_type_examination_data, lang_id_structure_validation_data_type_deterministic_decisions];
    let data_types_labels = [];
    data_types.forEach(function (type_id) {
        data_types_labels.push(get_language__label_by_id(type_id));
    })
    let node_prop = "data_type";
    let preselection = learned_structure_data.nodes.filter(x => x.id === node_under_investigation.id)[0][node_prop];

    append_selection(lang_id_variable_type, data_types, data_types_labels, node_prop, preselection);

    let groups = [], group_labels=[];

    initial_groups.forEach(function (group) {
        groups.push(group.id);
        group_labels.push(group.label);
    })


    preselection = "";
    if (initial_groups.filter(x => x.variables.includes(node_under_investigation.id)).length > 0) {
        preselection = initial_groups.filter(x => x.variables.includes(node_under_investigation.id))[0].id;
    }

    append_selection(lang_id_groups, groups, group_labels, lang_id_groups, preselection);

    append_editable_table(lang_id_variable_states);


    function append_editable_table(lang_id) {
        let metadata = [];
        console.log(node_under_investigation);

        metadata.push({ name: "id", label: "id", datatype: "string", editable: false});
        metadata.push({ name: "label", label:"label", datatype: "string", editable: true});

        let data = [];

        node_under_investigation.outcomes.forEach(function (d) {
            data.push({id: d.id, values: {"id":d.id,"label":d.label}});
        })

        let div = d3.select('#' + steps_structure_validation_div).append('div')
            .style('width', 100 + '%')
            .style('position', 'relative')
            .style('padding-top', 20+'px')
            .style('float', 'left')
        div.append('div').attr('class', "add_button");

        div.append('label')
            .text(get_language__label_by_id(lang_id))
            .append('div')
            .style('margin', 'var(--padding)')
            .attr('id', lang_id)
            .style('width', 'calc('+100+'% - var(padding))');



        let editableGrid = new EditableGrid("DemoGridJsData", {
            enableSort : false

        });
        editableGrid.load({"metadata": metadata, "data": data});
        editableGrid.renderGrid(lang_id, "testgrid");
        editableGrid.modelChanged = function(rowIndex, columnIndex, oldValue, newValue, row) {
//            console.log("ajfldValue for '" + this.getColumnName(columnIndex) + "' in row " + this.getRowId(rowIndex) + " has changed from '" + oldValue + "' to '" + newValue + "'");
            learned_structure_data.nodes.filter(x => x.id === node_under_investigation.id)[0].outcomes.filter(x => x.id === this.getRowId(rowIndex))[0].label = newValue;
            node_under_investigation.outcomes = learned_structure_data.nodes.filter(x => x.id === node_under_investigation.id)[0].outcomes;

        };

    }


    //------------------------append text input
    function append_text_input (lang_id, label, node_prop) {

        let selection_div = d3.select('#' + steps_structure_validation_div).append('div')
            .style('width', 100 + '%')
            .style('position', 'relative')
            .style('float', 'left')
            .append('label')
            .text(get_language__label_by_id(lang_id))
            .append('input')
            .style('margin', 'var(--padding)')
            .style('width', 'calc(' + 100+'% - 6*var(--padding) + 1px)')
            .attr('type', 'text')
            .attr('value',label);

        selection_div.on('change', function () {
            node_under_investigation[node_prop] = this.value;
            learned_structure_data.nodes.filter(x => x.id === node_under_investigation.id)[0][node_prop] = this.value;
            update_network_views_after_change();
        })
    }

    //------------------------append dropdown selection
    function append_selection(lang_id, data_types, labels, node_prop, preselection) {
        let selection_div = d3.select('#' + steps_structure_validation_div).append('div')
            .style('width', 100 + '%')
            .style('position', 'relative')
            .style('float', 'left')
            .style('padding-top', 20+'px')
            .append('label')
            .text(get_language__label_by_id(lang_id))
            .append('select')
            .attr('class', 'fstdropdown-select')
            .attr('id', lang_id)

        setFstDropdown(); // this needs to be set to have it as a FstDropdown
        selection_div.append('option').attr('value', "").text('Select option');

        let select = selection_div.node();

        data_types.forEach(function (data_type, i) {
            let opt = document.createElement("option");
            opt.text = labels[i];
            opt.value = data_type;
            opt.id = steps_structure_validation_div

            select.add(opt);
        });


        document.querySelector("#" + lang_id).fstdropdown.rebind();

        d3.select(select).on('change', function (d) {
            if (node_prop === lang_id_groups) {
                // remove element from other list

                let groups_including_variable = initial_groups.filter(x => x.variables.includes(node_under_investigation.id));
                if (groups_including_variable.length>0) {
                    initial_groups.filter(x => x.variables.includes(node_under_investigation.id))[0].variables = initial_groups.filter(x => x.variables.includes(node_under_investigation.id))[0].variables.filter(e => e !== node_under_investigation.id);
                }
                if (this.value !== "") {
                    // add to newly selected one
                    initial_groups.filter(x => x.id === this.value)[0].variables.push(node_under_investigation.id);

                    console.log(initial_groups)
                }
            } else {
                learned_structure_data.nodes.filter(x => x.id === node_under_investigation.id)[0][node_prop] = this.value
            }
            update_network_views_after_change();
        });

        d3.select(select).node().value =  preselection;
        document.querySelector("#" + lang_id).fstdropdown.rebind();

        d3.selectAll('.fstselected').style('color', '#444168')
            .style('font-weight', '400')
            .style('font-size', 16+'px')
            .style('border-radius', 6+'px')
    }
}


function update_network_views_after_change () {
    update_network_view(learned_structure_data, id_network_view, id_network_view_child);
    [node_validation_network_structure, node_under_investigation] = select_variable_for_validation();

    update_network_view(node_validation_network_structure, structure_validation_viewer_div, 'structure_validation_viewer_div_child');
}
