
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

    computed_dagre_layout_x_pos = computed_dagre_layout_x_pos.sort((a,b) => a.x - b.x).reverse();

    computed_dagre_layout_x_pos.forEach(function (d) {

        let node = node_distinction.filter(x => x.node_id === d.id)[0];

        let related_node = learned_structure_data.nodes.filter(x => x.id === node.node_id)[0];
        let node_line_div = nodes_overview_div.append('div')
            .attr('class', 'nodes_overview_divs')
            .attr('id', 'nodes_overview'+splitter+node.node_id)
            .style('width', 100+'%')
            .style('height', 50+'px')
            .style('border-radius', 'var(--div-border-radius)')
            .style('margin', '5px 0 5px 0');

        node_line_div.append('div')
            .style('width', (100/header_labels.length)+'%')
            .style('float', 'left')
            .append('p')
            .style('margin', '10px 0 10px 0')
            .text(related_node.label)
            .on('click', function () {
                d3.selectAll('.nodes_overview_divs').style('background-color', 'white')
                node_line_div.style('background-color', '#E8E8E8')
            })

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

        let percentage_div_bar = percentage_div.append('div')
            .style('float', 'left')
            .style('width', 'calc(100% - ' + percentage_div_width + 'px)')
            .style('height', 'calc('+100+'% - 0px)')
            .append('div')
            .style('width', node.percentage+'%')
            .style('height', 100+'%')
            .style('border-radius', 'var(--div-border-radius)')
            .style('background-color', color_distinction_percentage(node.percentage))
            //.style('border-color', 'var(--main-font-color)')
            //.style('border-style', 'solid')

        tippy(percentage_div_bar.node(), {
            content: node.percentage.toFixed(0)+'%',
            placement: "top-start",
            appendTo: 'parent',
        });

        node_line_div.append('div')
            .style('width', (100/header_labels.length)+'%')
            .style('float', 'left')
            .append('p')
            .style('margin', '10px 0 10px 0')
            .text(node.distinction_probabilities_and_data.length)

        // node_line_div.append('svg').style('width', 100+'%').style('height', 100+'%').append("svg:defs").append("svg:marker")
        //     .attr("id", "triangle")
        //     .attr("refX", 6)
        //     .attr("refY", 6)
        //     .attr("markerWidth", 30)
        //     .attr("markerHeight", 30)
        //     .attr("orient", "auto")
        //     .append("path")
        //     .attr("d", "M 0 0 12 6 0 12 3 6")
        //     .style("fill", "black");
    })
}