const header_labels = ['Evidence', 'Outcome', 'Relevance'];
let index_patient = 0;
let index_node = 0;
function initialize_patient_case_investigation(parent_div_id) {

    d3.select('#' + parent_div_id).selectAll('*').remove()

    let header_div = d3.select('#' + parent_div_id)
        .style('height', function () {
            return 'calc('+100+'% - '+ (this.offsetTop - 7) +'px)'
        })
        .append('div')
        .attr('id', 'header_div_id')
        .style('width', 50+'%');


    let label_height = 0;
    header_labels.forEach(function (header) {
        let label_div = header_div.append('div')
            .style('height', '100%')
            .style('width', (100/header_labels.length)+'%')
            .style('float', 'left')
            .append('p')
            .style('margin', '10px 0 10px 0')
            .style('font-weight', 500)
            .text(header)
            .style('color', 'var(--main-font-color)')

        if (label_height<$(label_div.node()).outerHeight(true)) { // get the height including margins
            label_height = $(label_div.node()).outerHeight(true)
        }
    })

    header_div.style('height', label_height + 'px');

    let space_between_divs = 10;

    d3.select('#' + parent_div_id)
        .append('div')
        .style('float', 'left')
        .attr('id', 'evidence_information_div')
        .style('width', 'calc('+ 50+'% - '+space_between_divs+'px)')
        .style('height', function () {
            return 'calc('+100+'% - '+ label_height +'px)'
        })
        .style('overflow-y', 'auto');

    let comparison_div = d3.select('#' + parent_div_id)
        .append('div')
        .attr('id', 'comparison_div')
        .style('width', 'calc('+ 50+'% - ' + space_between_divs + 'px)')
        .style('float', 'right')
        .style('height', function () {
            return 'calc('+100+'% - '+ label_height +'px)'
        })
        .style('overflow-y', 'auto');

    comparison_div
        .append('p')
        .style('margin', '10px 0 10px 0')
        .html('<u>observed</u> outcome:');

    update_patient_case_investigation_view()
}

function update_patient_case_investigation_view () {

    let used_node_distinction = get_distinction_with_differentiation();

    // in case the node has no distinctions, go to next one
    function get_distinction_with_differentiation() {
        let used_node_distinction = node_distinction.filter(x=> x.node_id === computed_dagre_layout_x_pos[index_node].id)[0];

        if (used_node_distinction.distinction_probabilities_and_data.length > 0) {
            return used_node_distinction
        } else {
            index_node +=1;
            if (index_node === node_distinction.length) {
                return false;
            }
            return get_distinction_with_differentiation();
        }
    }

    if (!used_node_distinction) {

    } else {

        d3.select('#node_under_validation_p').style('color', 'var(--main-font-color)').node().innerHTML = 'Node under validation: <u>' + learned_structure_data.nodes.filter(x => x.id === used_node_distinction.node_id)[0].label.bold() + '</u>';

        update_evidence_view(used_node_distinction);
        update_outcome_view(used_node_distinction);
    }

}

function update_outcome_view (used_node_distinction) {

    let comparison_div = d3.select('#' + 'comparison_div');
    comparison_div
        .append('p')
        .style('margin', '10px 0 10px 0')
        .style("text-align", "center")
        .node().innerHTML = used_node_distinction.distinction_probabilities_and_data[index_patient].data_outcome.bold();

    comparison_div
        .append('p')
        .style('margin-bottom', '10px')
        .html('<u>computed</u> outcome:');


    let max_index = used_node_distinction.distinction_probabilities_and_data[index_patient].probabilities.indexOf(Math.max(...used_node_distinction.distinction_probabilities_and_data[index_patient].probabilities));
    comparison_div
        .append('p')
        .style('margin', '10px 0 30px 0')
        .style("text-align", "center")
        .node().innerHTML = used_node_distinction.distinction_probabilities_and_data[index_patient].outcomes[max_index].bold();

    comparison_div
        .append('p')
        .style('margin-bottom', '10px')
        .text('the probability distribution should be [in %]:');

    let prob_distribution_div = comparison_div.append('div')
        .style('float', 'left')
        .style('width', 'calc(' + 100 + '% - ' + 5 + 'px)')
        .style('height', 'auto')
        .style('margin-bottom', 10+'px')

    let input_divs = comparison_div.append('div')
        .style('float', 'left')
        .style('position', 'relative')
        .style('width', 'calc(' + 100 + '% - ' + 5 + 'px)');

    let color_stacked_bar_chart = d3.scaleSequential().domain([0, used_node_distinction.distinction_probabilities_and_data[index_patient].outcomes.length])
        .interpolator(d3.interpolateBlues);

    used_node_distinction.distinction_probabilities_and_data[index_patient].probabilities.forEach(function (prob, index) {
        let prob_bar_div = prob_distribution_div.append('div')
            .attr('class', 'prob_div')
            .style('position', 'relative')
            .style('float', 'left')
            .style('width', prob*100 + '%')
            .style('height', 20+'px')
            .style('background-color', color_stacked_bar_chart(index + 1))
            .style('border-radius', 'var(--div-border-radius)');

        const instance = prob_bar_div.node()._tippy
        if (instance) {
            instance.destroy();
        }

        tippy(prob_bar_div.node(), {
            content: used_node_distinction.distinction_probabilities_and_data[index_patient].outcomes[index] + ': ' + (prob * 100).toFixed(0)+'%',
            placement: "top-start",
            appendTo: 'parent',
        });

        input_divs
            .append("label")
            .attr('id', 'label' + splitter +  used_node_distinction.distinction_probabilities_and_data[index_patient].outcomes[index])
            .text(used_node_distinction.distinction_probabilities_and_data[index_patient].outcomes[index] + ': ')
            .style('width', 100+'%')
            .style('float', 'left')
            .append('input')
            .style('float', 'right')
            .attr('type', 'number')
            .style('top', 5 + 'px')
            .attr('value', (prob*100).toFixed(0))
            .attr('min', 1)
            .attr('max', 99)
            .on('input', function () {

                let prob_sum = 0;
                let probabilities = [];
                let is100 = true;

                input_divs.selectAll('label').each(function () {
                    prob_sum += parseFloat(d3.select(this).select('input').node().value);
                    probabilities.push(parseFloat(d3.select(this).select('input').node().value));
                })


                if (prob_sum === 100) {
                    input_divs.select('.button').attr('disabled', null);
                } else {
                    is100 = false;
                    input_divs.select('.button').attr('disabled', true);
                }

                update_prob_bar_divs()

                function update_prob_bar_divs () {

                    let all_bars = d3.selectAll('.prob_div');
                    probabilities.forEach(function (prob, index_prob) {
                        d3.select(all_bars.nodes()[index_prob])
                            .transition()
                            .duration(transition_duration)
                            .style('width', prob + '%')
                            .style('border', function () {
                                if (is100) {
                                    return null;
                                } else {
                                    return "2px solid red";
                                }
                            })

                        const instance = prob_bar_div.node()._tippy
                        if (instance) {
                            instance.destroy();
                        }

                        tippy(prob_bar_div.node(), {
                            content: used_node_distinction.distinction_probabilities_and_data[index_patient].outcomes[index] + ': ' + prob +'%',
                            placement: "top-start",
                            appendTo: 'parent',
                        });
                    })
                }
            });
    });


    let dependend_on_other = input_divs.append('input')
        .attr('class', 'button')
        .style('font-size', 20+'px')
        .style('position', 'relative')
        .style('margin', 20+'px 0 10px 0')
        .style('float', 'bottom')
        .style('width', 100+'%')
        .attr('type', 'submit')
        .style('color', 'white')
        .style('background-color', 'var(--main-font-color)')
        .attr('value', 'Dependent on another variable')
        .on('click', header_backwards_button)

    const instance = dependend_on_other.node()._tippy
    if (instance) {
        instance.destroy();
    }

    tippy(dependend_on_other.node(), {
        content: 'If you think this variable is dependent on another variable, please click this and you will go back to Structure Validation page.',
        placement: "top-start",
        appendTo: 'parent',
    });


    input_divs.append('input')
        .attr('class', 'button')
        .style('position', 'relative')
        .style('margin', 20+'px 0 10px 0')
        .style('float', 'bottom')
        .style('width', 100+'%')
        .attr('type', 'submit')
        .attr('value', 'submit')
        .on('click', function () {
            let cpt_outcomes = [];
            input_divs.selectAll('label').each(function () {

                cpt_outcomes.push({
                    outcome: this.id.split(splitter)[1],
                    prob: parseFloat(d3.select(this).select('input').node().value/100)
                })
            })

            let related_learned_struc_inf = learned_structure_data.nodes.find(x => x.id === used_node_distinction.node_id);
            let related_parent_information = [];

            related_learned_struc_inf.parents.forEach(function (parent) {
                related_parent_information.push({
                    parent_node: parent,
                    parent_state: used_node_distinction.distinction_probabilities_and_data[index_patient].df[0][parent]
                })
            })

            let rel_index = related_learned_struc_inf.cpt.findIndex(is_related_inf_in_cpt);

            function is_related_inf_in_cpt(cpt) {
                let bool_equal = true;
                related_parent_information.forEach(function (d) {

                    if (cpt.parents.filter(x => x.parent_node === d.parent_node && x.parent_state === d.parent_state).length === 0) {
                        bool_equal = false;
                    }
                })

                if (bool_equal) {
                    return cpt;
                }
            }

            learned_structure_data.nodes.find(x => x.id === used_node_distinction.node_id).cpt[rel_index].probability = cpt_outcomes;

            function range(start, end) {
                return Array(end - start + 1).fill().map((_, idx) => start + idx)
            }

            let indexes = range(rel_index*cpt_outcomes.length, rel_index*cpt_outcomes.length + cpt_outcomes.length - 1); // [9, 10, 11, 12, 13, 14, 15, 16, 17, 18]

            update_cpt(function () {

                index_patient +=1;

                if (index_patient === used_node_distinction.distinction_probabilities_and_data.length) {
                    index_node +=1;
                    index_patient = 0;
                }
                update_network_view(learned_structure_data, id_network_view, id_network_view_child)

                initialize_ordered_node_list_view('nodes_overview');
                initialize_patient_case_investigation('patient_cases_validation_view');

            }, used_node_distinction.node_id, indexes, cpt_outcomes.map(a => a.prob))
        })

}

function update_evidence_view (used_node_distinction) {

    used_node_distinction.distinction_probabilities_and_data[index_patient].relevancies = used_node_distinction.distinction_probabilities_and_data[index_patient].relevancies
        .sort((a,b) => a.relevance_percentage - b.relevance_percentage).reverse()

    const ref_evidence_information = ['evidence_node', 'evidence_outcome', 'relevance_percentage'];

    let label_height = 0;

    used_node_distinction.distinction_probabilities_and_data[index_patient].relevancies.forEach(function (relevance_object) {
        header_labels.forEach(function (header, i) {

             if (i === 2) {
                let percentage_div = d3.select('#evidence_information_div').append('div')
                    //.style('width', (100 / header_labels.length) + '%')
                    .style('float', 'left')
                    .style('position', 'relative')
                    .style('width', 'calc(' + (100/header_labels.length)+'% - 5px)')
                    .append('div')
                    .style('height', (label_height - 19)+'px')
                    .style('width', function () {
                        if (relevance_object[ref_evidence_information[i]] > 0) {
                            return ((100 * relevance_object[ref_evidence_information[i]]) + '%')
                        } else return 0;
                    })
                    .style('background-color', 'var(--main-font-color)')
                    .style('border-radius', 'var(--div-border-radius)')
                    .style('margin', '10px 0 10px 0')

                tippy(percentage_div.node(), {
                    content: (relevance_object[ref_evidence_information[i]] * 100).toFixed(0)+'%',
                    placement: "top-start",
                    appendTo: 'parent',
                });
             } else {
                let label_div = d3.select('#evidence_information_div').append('div')
                    .style('width', (100 / header_labels.length) + '%')
                    .style('float', 'left')
                    .style('position', 'relative')
                    .append('p')
                    .style('margin', '10px 0 10px 0')
                    .text(function () {
                        if (relevance_object[ref_evidence_information[i]].length > 9) {
                            return relevance_object[ref_evidence_information[i]].slice(0,9) + '...'
                        } else {
                            return relevance_object[ref_evidence_information[i]]
                        }
                    })
                    .style('color', 'var(--main-font-color)')

                tippy(label_div.node(), {
                    content: relevance_object[ref_evidence_information[i]],
                    placement: "top-start",
                    appendTo: 'parent',
                });
                if (label_height<$(label_div.node()).outerHeight(true)) { // get the height including margins
                    label_height = $(label_div.node()).outerHeight(true)
                }
            }
        })
    })
}