let editableGrid = [];
const padding_top = 30;

function initialize_structure_validation_steps(node_under_investigation) {

    d3.select('#' + steps_structure_validation_div).selectAll('*').remove();

    append_text_input(lang_id_variable_identifier, node_under_investigation.label, 'label');

    const data_types = [lang_id_structure_validation_data_type_personal_data, lang_id_structure_validation_data_type_anomalies, lang_id_structure_validation_data_type_examination_data, lang_id_structure_validation_data_type_deterministic_decisions];
    let data_types_labels = [];
    data_types.forEach(function (type_id) {
        data_types_labels.push(get_language__label_by_id(type_id));
    })
    let node_prop = "data_type";
    let preselection = learned_structure_data.nodes.filter(x => x.id === node_under_investigation.id)[0][node_prop];

    append_selection(lang_id_variable_type, data_types, data_types_labels, node_prop, preselection);

    let groups = [], group_labels = [];

    initial_groups.forEach(function (group) {
        groups.push(group.id);
        group_labels.push(group.label);
    })

    preselection = "";
    if (initial_groups.filter(x => x.variables.includes(node_under_investigation.id)).length > 0) {
        preselection = initial_groups.filter(x => x.variables.includes(node_under_investigation.id))[0].id;
    }

    append_selection(lang_id_groups, groups, group_labels, lang_id_groups, preselection);

    append_states_validation(lang_id_variable_states);


    append_parent_node_validation(lang_id_variable_parents);


    function append_set_node_validated(lang_id_validated) {
        d3.select('#' + steps_structure_validation_div).append('div')
            .style('width', 100 + '%')
            .style('position', 'relative')
            .style('float', 'right')
            .append('input').attr('class', 'button')
            .attr('readonly', "readonly")
            .attr('value', get_language__label_by_id(lang_id_validated))
            .style('position', 'relative')
            .style('margin', 10 + 'px')
            .style('width', 'calc(' + 100 + '% - 80px)')
            .on('click', function (d) {
                learned_structure_data.nodes.find(x => x.id === node_under_investigation.id).structure_validated = true;
                learned_structure_data.nodes.find(x => x.id === node_under_investigation.id).notes_comments =
                    d3.select('#' + 'notes_comments_text').node().value + ''

                update_network_views_after_change();

                let percentage_finished = (learned_structure_data.nodes.filter(x => x.structure_validated).length * 100 / learned_structure_data.nodes.length).toFixed(0);

                d3.select('#' + 'myBar').style('width', percentage_finished + '%').text(percentage_finished + '%');
                if (percentage_finished + '' === '100') {
                    d3.select('#' + 'forward_button').attr('disabled', null)
                } else {
                    //d3.select('#' + 'forward_button').attr('disabled', 'disabled')
                }
            });
    }

    function append_parent_node_validation(lang_id) {
        compute_chi_square(function (chi2_data) {
            chi2_data.sort((a, b) => (a.p_value > b.p_value) ? 1 : -1)

            // create data for table
            let metadata = [];
            //metadata.push({name: "id", label: "id", datatype: "string", hidden: true, renderable: false});
            metadata.push({name: "is_parent", label: "is parent", datatype: "boolean", editable: true});
            metadata.push({name: "label", label: "label", datatype: "string", editable: false});
            metadata.push({name: "p_value", label: "correlation coefficient", datatype: "number", editable: false});

            //metadata.push({name: 'action', label: "", datatype: 'html', editable: false});

            let data = [];

            chi2_data.forEach(function (d) {
                let related_node = learned_structure_data.nodes.filter(x => x.id === d.node_id)[0];

                if (d.node_id !== node_under_investigation.id) {
                    data.push({
                        id: d.node_id,
                        values: {
                            "is_parent": node_under_investigation.parents.includes(d.node_id),
                            "label": related_node.label,
                            "id": related_node.id,
                            "p_value": parseFloat(d.p_value).toFixed(6)
                        }
                    });
                }
            })

            append_editable_table(lang_id, metadata, data, 1);

            append_set_node_validated(lang_id_validated);

        }, node_under_investigation.id);
    }

    function append_states_validation(lang_id) {
        // create data for table
        let metadata = [];
        metadata.push({name: "id", label: "id", datatype: "string", editable: false});
        metadata.push({name: "label", label: "label (editable)", datatype: "string", editable: true});
        metadata.push({name: 'action', label: "", datatype: 'html', editable: false});

        let data = [];

        node_under_investigation.outcomes.forEach(function (d) {
            data.push({id: d.id, values: {"id": d.id, "label": d.label}});
        })

        append_editable_table(lang_id, metadata, data, 0)
    }

    function append_editable_table(lang_id, metadata, data, index_table) {

        //append label and table
        let div = d3.select('#' + steps_structure_validation_div).append('div')
            .style('width', 100 + '%')
            .style('position', 'relative')
            .style('padding-top', padding_top + 'px')
            .style('float', 'left')

        if (lang_id === lang_id_variable_states) {
            //append add button
            div.append('div').attr('class', "add_button")
                .on('click', function () {

                    let added_node_index = node_under_investigation.outcomes.length;

                    learned_structure_data.nodes.filter(x => x.id === node_under_investigation.id)[0].outcomes.push({
                        id: 'outcome' + added_node_index,
                        label: 'outcome' + added_node_index,
                        original: false
                    });

                    node_under_investigation.outcomes.push({
                        id: 'outcome' + added_node_index,
                        label: 'outcome' + added_node_index,
                        original: false
                    })

                    editableGrid[index_table].append('outcome' + added_node_index, {
                        "id": 'outcome' + added_node_index,
                        "label": 'outcome' + added_node_index
                    });
                    d3.select('th.editablegrid-action').text('');

                });
        }

        div.append('label')
            .text(get_language__label_by_id(lang_id))
            .append('div')
            .style('overflow-y', 'scroll')
            .style('max-height', 200 + 'px')
            .style('margin', 'var(--padding)')
            .attr('id', lang_id)
            .style('width', 'calc(' + 100 + '% - var(padding))');

        let enable_sort = false; //lang_id !== lang_id_variable_states;
        // initialize table
        editableGrid[index_table] = new EditableGrid("DemoGridJsData", {
            enableSort: enable_sort
        });
        editableGrid[index_table].load({"metadata": metadata, "data": data});
        editableGrid[index_table].renderGrid(lang_id, "testgrid");

        editableGrid[index_table].modelChanged = function (rowIndex, columnIndex, oldValue, newValue, row) {
            if (this.getColumnName(columnIndex) === 'label') {
                learned_structure_data.nodes.filter(x => x.id === node_under_investigation.id)[0].outcomes.filter(x => x.id === this.getRowId(rowIndex))[0].label = newValue;
                node_under_investigation.outcomes = learned_structure_data.nodes.filter(x => x.id === node_under_investigation.id)[0].outcomes;
            } else {

                if (newValue) {
                    learned_structure_data.nodes.filter(x => x.id === node_under_investigation.id)[0].parents.push(this.getRowId(rowIndex));
                    learned_structure_data.nodes.filter(x => x.id === this.getRowId(rowIndex))[0].children.push(node_under_investigation.id);

                    learned_structure_data.edges.push({
                        edge_to: node_under_investigation.id,
                        edge_from: this.getRowId(rowIndex),
                        edge_strength: 1
                    });

                } else {
                    learned_structure_data.nodes.find(x => x.id === node_under_investigation.id).parents =
                        learned_structure_data.nodes.find(x => x.id === node_under_investigation.id).parents.filter(e => e !== this.getRowId(rowIndex));

                    learned_structure_data.nodes.find(x => x.id === this.getRowId(rowIndex)).children =
                        learned_structure_data.nodes.find(x => x.id === this.getRowId(rowIndex)).children.filter(e => e !== node_under_investigation.id);

                    learned_structure_data.edges = learned_structure_data.edges.filter(x => !(x.edge_from === this.getRowId(rowIndex) && x.edge_to === node_under_investigation.id))
                }

                update_network_views_after_change();

            }
        };

        if (lang_id === lang_id_variable_states) {
            // renderer for the action column to remove row
            // just applicable to newly entered states
            editableGrid[index_table].setCellRenderer("action", new CellRenderer({
                render: function (cell, value) {

                    let current_outcome = learned_structure_data.nodes.filter(x => x.id === node_under_investigation.id)[0].outcomes.filter(x => x.id === editableGrid[index_table].getRowId(cell.rowIndex))[0];

                    let image = d3.select(cell).append('a')
                        .style('cursor', 'pointer')
                        .append('img')
                        .attr('src', "resources/cancel.svg")
                        .style('border', 0)
                        .attr('alt', 'delete')
                        .attr('title', 'delete')
                        .style('display', 'block')
                        .style('margin-left', 'auto')
                        .style('margin-right', 'auto')
                        .style('width', 40 + '%')
                        .style('opacity', function () {
                            if (current_outcome.original) {
                                return 0.5;
                            }
                            return 1;
                        })


                    image.on('click', function (d) {
                        if (!current_outcome.original) {

                            editableGrid[index_table].remove(cell.rowIndex);
                            d3.select('th.editablegrid-action').text('');

                            learned_structure_data.nodes.filter(x => x.id === node_under_investigation.id)[0].outcomes = learned_structure_data.nodes.filter(x => x.id === node_under_investigation.id)[0].outcomes.filter(x => x.id !== current_outcome.id)
                            node_under_investigation.outcomes = node_under_investigation.outcomes.filter(x => x.id !== current_outcome.id);
                        }
                    })
                }
            }));
        }
        editableGrid[index_table].renderGrid(lang_id, "testgrid");

        d3.select('th.editablegrid-action').text('');
    }


    //------------------------append text input
    function append_text_input(lang_id, label, node_prop) {

        let selection_div = d3.select('#' + steps_structure_validation_div).append('div')
            .style('width', 100 + '%')
            .style('position', 'relative')
            .style('float', 'left')
            .append('label')
            .text(get_language__label_by_id(lang_id))
            .append('input')
            .style('margin', 'var(--padding)')
            .style('width', 'calc(' + 100 + '% - 6*var(--padding) + 1px)')
            .attr('type', 'text')
            .attr('value', label);

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
            .style('padding-top', padding_top + 'px')
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
                if (groups_including_variable.length > 0) {
                    initial_groups.filter(x => x.variables.includes(node_under_investigation.id))[0].variables = initial_groups.filter(x => x.variables.includes(node_under_investigation.id))[0].variables.filter(e => e !== node_under_investigation.id);
                }
                if (this.value !== "") {
                    // add to newly selected one
                    initial_groups.filter(x => x.id === this.value)[0].variables.push(node_under_investigation.id);

                }
            } else {
                learned_structure_data.nodes.filter(x => x.id === node_under_investigation.id)[0][node_prop] = this.value
            }
            update_network_views_after_change();
        });

        d3.select(select).node().value = preselection;
        document.querySelector("#" + lang_id).fstdropdown.rebind();

        d3.selectAll('.fstselected').style('color', '#444168')
            .style('font-weight', '400')
            .style('font-size', 16 + 'px')
            .style('border-radius', 6 + 'px')
    }
}


function update_network_views_after_change(node_validation_network_structure, node_under_investigation) {
    update_network_view(learned_structure_data, id_network_view, id_network_view_child);

    if (!node_validation_network_structure) {
        [node_validation_network_structure, node_under_investigation] = select_variable_for_validation();
    }

    update_network_view(node_validation_network_structure, structure_validation_viewer_div, 'structure_validation_viewer_div_child');
    update_network_views_node_for_validation(node_under_investigation);
    update_network_overview_for_validated_nodes();

    setTimeout(() => {


        let related_paths = d3.selectAll('.' + class_network_paths).filter(function () {

            let splitted_id = this.id.split(splitter);

            if (!this.id.includes('.')) {

                if (splitted_id)
                    if (!d3.select('#' + circle_id + splitted_id[1]).empty() && !d3.select('#' + circle_id + splitted_id[2]).empty()) {
                        return (parseFloat(d3.select('#' + circle_id + splitted_id[1]).style('cx')) > parseFloat(d3.select('#' + circle_id + splitted_id[2]).style('cx')))
                    }
            }

        }).transition().duration(transition_duration)
            .style('stroke', 'rgb(255, 0, 0)').style('stroke-width', 6 + 'px');



    }, 2 * transition_duration + 10);
}
