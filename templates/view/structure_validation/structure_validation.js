
function initialize_edge_validation () {
    console.log(learned_structure_data)


    const radio_button_inputs = [{
        left: 20,
        value: 'correct',
    }, {
        left: 50,
        value: 'wrong'
    }, {
        left: 80,
        value: 'turnaround'
    }];

    let legend_top = d3.select('#' + edge_validation_div).append('div')
        .style('float', 'right')
        .style('width', 50+'%')
        .style('height', 30+'px')
        //.style('background-color', 'green');

    legend_top.append('svg').style('width', 100+'%')
        .style('height', 100+'%')
    radio_button_inputs.forEach(function (r_input) {
        legend_top.select('svg').append('text')
            .attr('x', r_input.left + '%')
            .attr('y', 20 + 'px')
            .style('text-anchor', "middle")
            .style('fill', 'var(--main-font-color)')
            .text(r_input.value)
    });


    let edges_validation_div_content = d3.select('#' + edge_validation_div).append('div').attr('class', validation_div_content_class);
    let edges_sort = learned_structure_data.edges.sort((a,b) => (a.edge_strength > b.edge_strength) ? 1 : ((b.edge_strength > a.edge_strength) ? -1 : 0));
    console.log(edges_sort)

    edges_sort.forEach(function (edge, index) {
        let edge_val_div = edges_validation_div_content.append('div')
            .style('float', 'left')
            .style('position', 'relative')
            .style('width', 'calc('+100+'% - ' + 5 + 'px)')
            .style('height', 60+'px')
            .style('margin', 5+'px');


        let left_edge_presentation_div = edge_val_div.append('div')
            .style('float', 'left')
            .style('position', 'relative')
            .style('width', 'calc('+ 50+'% - ' + 0 + 'px)')
            .style('height', 100+'%');


        let right_edge_presentation_div = edge_val_div.append('div')
            .style('float', 'left')
            .style('position', 'relative')
            .style('width', 'calc('+50+'% - ' + 0 + 'px)')
            .style('height', 100+'%')
            .style('background-color', '#E8E8E8');


        radio_button_inputs.forEach(function (r_input) {
            right_edge_presentation_div.append('input')
                .attr('type', 'radio')
                .attr('name', 'edge_direction')
                .style('position', 'absolute')
                .style('left', 'calc(' + r_input.left+'% - 9px)')
                .style('top', 'calc(' + 50+'% - 9px)')
                .attr('value', r_input.value)
                .text(r_input.value);
        })
    })

}