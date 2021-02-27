
function update_individual_graph_view() {

    const allAges = learned_structure_data.nodes.map(a => a.graph);

    const uniqueSet = new Set(allAges)
    let uniqueArray = [...uniqueSet]

    uniqueArray = uniqueArray.sort();

    uniqueArray.forEach(function (unique_graph) {
        let individual_div = d3.select('#' + 'individual_graph_view').append('div')
            .style('position', 'relative')
            .style('float', 'left')
            .style('width', 100+'%')
            .style('height', 50 + 'px')
            .style('margin-bottom', 10+'px');

        let left_div = individual_div.append('div')
            .style('position', 'relative')
            .style('float', 'left')
            .style('width', 100+'px')
            .style('height', 100 + '%');

        left_div.append('p')
            .style('margin-top', 10+'px')
            .text('graph: ' + unique_graph);

        individual_div.append('div')
            .style('position', 'relative')
            .style('float', 'left')
            .style('width', 40+'px')
            .style('height', 100 + '%')
            .style('border-radius', 'var(--div-border-radius)')
            .style('background-color', color_subgraphs(unique_graph));

        let center_div = individual_div.append('div')
            .style('position', 'relative')
            .style('float', 'left')
            .style('width', 200+'px')
            .style('margin-left', 20 + 'px')
            .style('height', 100 + '%');

        center_div.append('p')
            .style('margin-top', 10+'px')
            .text('node count: ' + learned_structure_data.nodes.filter(x => x.graph === unique_graph).length);

        let right_div = individual_div.append('div')
            .style('position', 'relative')
            .style('float', 'left')
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
            .text('nodes:  ' + nodes_array_text);
    })
}