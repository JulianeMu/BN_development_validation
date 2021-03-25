const header_labels = ['Evidence', 'Outcome', 'Relevance'];

function initialize_patient_case_investigation(parent_div_id) {

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
        .text('observed outcome:');
    update_patient_case_investigation_view()
}

function update_patient_case_investigation_view () {

    let used_node_distinction = node_distinction.filter(x=> x.node_id === computed_dagre_layout_x_pos[0].id)[0];

    d3.select('#node_under_validation_p').node().innerHTML = 'Node under validation: ' + learned_structure_data.nodes.filter(x=> x.id === used_node_distinction.node_id)[0].label.bold();

    update_evidence_view(used_node_distinction);
    update_outcome_view(used_node_distinction);

}

function update_outcome_view (used_node_distinction) {

    let comparison_div = d3.select('#' + 'comparison_div');
    comparison_div
        .append('p')
        .style('margin', '10px 0 10px 0')
        .style("text-align", "center")
        .node().innerHTML = used_node_distinction.distinction_probabilities_and_data[0].data_outcome.bold();

    comparison_div
        .append('p')
        .style('margin-bottom', '10px')
        .text('computed outcome:');

    let max_index = used_node_distinction.distinction_probabilities_and_data[0].probabilities.indexOf(Math.max(...used_node_distinction.distinction_probabilities_and_data[0].probabilities));
    comparison_div
        .append('p')
        .style('margin', '10px 0 30px 0')
        .style("text-align", "center")
        .node().innerHTML = used_node_distinction.distinction_probabilities_and_data[0].outcomes[max_index].bold();

    comparison_div
        .append('p')
        .style('margin-bottom', '10px')
        .text('the probability distribution should be:');

    let prob_distribution_div = comparison_div.append('div')
        .style('float', 'left')
        .style('width', 'calc(' + 100 + '% - ' + 5 + 'px)')
        .style('height',20 + 'px')
        .style('margin-bottom', 10+'px')

    let input_divs = comparison_div.append('div')
        .style('float', 'left')
        .style('width', 'calc(' + 100 + '% - ' + 5 + 'px)');

    let color_stacked_bar_chart = d3.scaleSequential().domain([0, used_node_distinction.distinction_probabilities_and_data[0].outcomes.length])
        .interpolator(d3.interpolatePuRd);

    used_node_distinction.distinction_probabilities_and_data[0].probabilities.forEach(function (prob, index) {
        let prob_bar_div = prob_distribution_div.append('div')
            .style('float', 'left')
            .style('width', prob*100 + '%')
            .style('height', 100+'%')
            .style('background-color', color_stacked_bar_chart(index + 1))
            .style('border-radius', 'var(--div-border-radius)');

        tippy(prob_bar_div.node(), {
            content: used_node_distinction.distinction_probabilities_and_data[0].outcomes[index] + ': ' + (prob * 100).toFixed(0)+'%',
            placement: "top-start",
            appendTo: 'parent',
        });

        input_divs
            .append("label")
            .text(used_node_distinction.distinction_probabilities_and_data[0].outcomes[index] + ': ')
            .style('width', 100+'%')
            .style('float', 'left')
            .append('input')
            .style('float', 'right')
            //.attr('id', keys[Math.floor(i / input.length)] + '___' + i % input.length)
            .attr('type', 'number')
            //.style('top', 5 + 'px')
            //.style('right', ((keys.length - 1 - Math.floor(i / input.length)) * 65) + 'px')
            .attr('value', (prob*100).toFixed(0))
            // .on('input', function () {
            //     input[i % input.length][keys[Math.floor(i / input.length)]] = parseFloat(this.value);
            //
            //     learned_structure_data.nodes.find(x => x.id === node_under_inv.id)
            //         .cpt[d.data.index]
            //         .probability.find(x => x.outcome === keys[Math.floor(i / input.length)]).prob = parseFloat(this.value);
            //
            //     update_stackedBarChart(input, transition_duration, node_under_inv);
            // });
    })
}

function update_evidence_view (used_node_distinction) {

    used_node_distinction.distinction_probabilities_and_data[0].relevancies = used_node_distinction.distinction_probabilities_and_data[0].relevancies
        .sort((a,b) => a.relevance_percentage - b.relevance_percentage).reverse()

    const ref_evidence_information = ['evidence_node', 'evidence_outcome', 'relevance_percentage'];

    let label_height = 0;

    used_node_distinction.distinction_probabilities_and_data[0].relevancies.forEach(function (relevance_object) {
        header_labels.forEach(function (header, i) {

            if (i === 2) {
                let percentage_div = d3.select('#evidence_information_div').append('div')
                    .style('width', 'calc(' + (100/header_labels.length)+'% - 5px)')
                    .style('height', label_height+'px')
                    .style('float', 'left')
                    .append('div')
                    .style('height', 60+'%')
                    .style('width', function () {
                        if (relevance_object[ref_evidence_information[i]] > 0) {
                            return (100 / relevance_object[ref_evidence_information[i]] + '%')
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