
function initialize_ordered_node_list_view (parent_div_id) {

    let header_div = d3.select('#' + parent_div_id).append('div').style('width', 100+'%');
    const header_labels = ['Node', 'Distinction Percentage', 'Number of Distinctions'];

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


    let nodes_overview_div = d3.select('#' + parent_div_id)
        .append('div')
        .style('width', 100+'%')
        .style('height', 'calc(100% - ' + label_height +'px)')
        .style('float', 'left')
        .style('overflow-y', 'auto')

    const percentage_div_width = 55;

    node_distinction = node_distinction.sort((a,b) => (a.df.length > b.df.length) ? -1 : ((b.df.length > a.df.length) ? 1 : 0))
    console.log(node_distinction)

    node_distinction.forEach(function (node) {

        let related_node = learned_structure_data.nodes.filter(x => x.id === node.node_id)[0];
        let node_line_div = nodes_overview_div.append('div')
            .style('width', 100+'%')
            .style('height', 40+'px')
            .style('margin', '5px 0 5px 0');

        node_line_div.append('div')
            .style('width', (100/header_labels.length)+'%')
            .style('float', 'left')
            .append('p')
            .style('margin', '10px 0 10px 0')
            .text(related_node.label)

        let percentage_div = node_line_div.append('div')
            .style('width', 'calc('+(100/header_labels.length)+'% - 10px)')
            .style('height', 100+'%')
            .style('float', 'left')
            .style('padding-right', 10+'px')

        percentage_div.append('div')
            .style('float', 'left')
            .style('width', percentage_div_width+'px')
            .append('p')
            .style('margin', '10px 0 10px 0')
            .text(node.percentage.toFixed(0)+'%')

        percentage_div.append('div')
            .style('float', 'left')
            .style('width', 'calc(100% - ' + percentage_div_width + 'px)')
            .style('height', 100+'%')
            .append('div')
            .style('width', node.percentage+'%')
            .style('height', 100+'%')
            .style('border-radius', 'var(--div-border-radius)')
            .style('background-color', 'var(--main-font-color)')

        node_line_div.append('div')
            .style('width', (100/header_labels.length)+'%')
            .style('float', 'left')
            .append('p')
            .style('margin', '10px 0 10px 0')
            .text(node.df.length)
    })
}