
function update_individual_graph_view() {

    d3.select('#' + 'individual_graph_view').selectAll('*').remove();

    const allAges = learned_structure_data.nodes.map(a => a.graph);

    const uniqueSet = new Set(allAges)
    let uniqueArray = [...uniqueSet]

    uniqueArray = uniqueArray.sort();

    uniqueArray.forEach(function (unique_graph) {

        let individual_div = d3.select('#' + 'individual_graph_view').append('div')
            .style('position', 'relative')
            .style('float', 'left')
            .style('width', 100+'%')
            //.style('height', 50 + 'px')
            .style('margin-bottom', 10+'px');

        let float_right = 0;

        let left_div = individual_div.append('div')
            .style('position', 'relative')
            .style('float', 'left')
            .style('width', 100+'px')
            .style('height', 100 + '%');

        float_right += 100;

        left_div.append('p')
            .style('margin-top', 10+'px')
            .text('graph: ' + unique_graph);

        individual_div.append('div')
            .style('position', 'relative')
            .style('float', 'left')
            .style('width', 40+'px')
            .style('height', 50 + 'px')
            .style('border-radius', 'var(--div-border-radius)')
            .style('background-color', color_subgraphs(unique_graph));
        float_right += 40;

        let center_div = individual_div.append('div')
            .style('position', 'relative')
            .style('float', 'left')
            .style('width', 100 + 'px')
            .style('margin-left', 20 + 'px')
            .style('height', 100 + '%');
        float_right += 120;

        center_div.append('p')
            .style('margin-top', 10+'px')
            .text('node count: ' + learned_structure_data.nodes.filter(x => x.graph === unique_graph).length);

        float_right += 20;

        let right_div = individual_div.append('div')
            .style('position', 'relative')
            .style('float', 'left')
            .style('width', 'calc(100% - ' + float_right +'px)')
            .style('margin-left', 20 + 'px')
            .style('height', 100 + '%');

        let nodes_array_text = "";
        learned_structure_data.nodes.filter(x => x.graph === unique_graph).forEach(function (d, i) {
            if (i > 0) {
                nodes_array_text += ', ';
            }
            nodes_array_text += d.label;
        })

        right_div.append('p')
            .style('margin-top', 10+'px')
            .text(nodes_array_text);
    })
}