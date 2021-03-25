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

    d3.select('#' + parent_div_id)
        .append('div')
        .attr('id', 'evidence_information_div')
        .style('width', 50+'%')
        .style('height', function () {
            return 'calc('+100+'% - '+ label_height +'px)'
        })
        .style('overflow-y', 'auto');

    update_patient_case_investigation_view()
}

function update_patient_case_investigation_view () {
    computed_dagre_layout_x_pos = computed_dagre_layout_x_pos.sort((a,b) => a.x - b.x).reverse();

    node_distinction[0].distinction_probabilities_and_data[0].relevancies = node_distinction[0].distinction_probabilities_and_data[0].relevancies
        .sort((a,b) => a.relevance_percentage - b.relevance_percentage).reverse()

    const ref_evidence_information = ['evidence_node', 'evidence_outcome', 'relevance_percentage'];

    let label_height = 0;

    node_distinction[0].distinction_probabilities_and_data[0].relevancies.forEach(function (relevance_object) {
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