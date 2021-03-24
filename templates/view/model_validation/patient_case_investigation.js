
function initialize_patient_case_investigation(parent_div_id) {
    let header_div = d3.select('#' + parent_div_id).append('div').style('width', 50+'%');


    const header_labels = ['Evidence', 'Outcome', 'Relevance'];

    let label_height = 0;
    header_labels.forEach(function (header) {
        let label_div = header_div.append('div')
            .style('width', (100/header_labels.length)+'%')
            .style('float', 'left')
            .append('p')
            .style('margin', '10px 0 10px 0')
            .style('font-weight', 500)
            .text(header)
            .style('color', 'var(--main-font-color)')

        if (label_height<parseFloat(label_div.style('height'))) {
            label_height = parseFloat(label_div.style('height'))
        }

    })
}