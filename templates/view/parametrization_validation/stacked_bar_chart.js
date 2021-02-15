let keys, x, y, z;


function initialize_stacked_bar_chart(node_under_inv) {

    d3.select('#' + steps_structure_validation_div).selectAll('*').remove();

    d3.select('#structure_validation_div').select('#NodeLabel').text(node_under_inv.label)

    d3.select('#' + steps_structure_validation_div).append('svg')
        .attr('id', 'chart')
        .attr('width', parseFloat(d3.select('#' + steps_structure_validation_div).style('width')))
        .attr('height', 320)

    let transformed_data = transform_data_for_stackedBarChart(node_under_inv);

    chart(transformed_data)

    append_set_node_validated_parametrization(lang_id_validated);

    function append_set_node_validated_parametrization(lang_id_validated) {
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
                learned_structure_data.nodes.find(x => x.id === node_under_inv.id).cpt_validated = true;
                learned_structure_data.nodes.find(x => x.id === node_under_inv.id).notes_comments =
                    d3.select('#' + 'notes_comments_text').node().value + ''

                update_network_views_after_change();

                let percentage_finished = (learned_structure_data.nodes.filter(x => x.cpt_validated).length * 100 / learned_structure_data.nodes.length).toFixed(0);

                d3.select('#' + 'myBar').style('width', percentage_finished + '%').text(percentage_finished + '%');
                if (percentage_finished + '' === '100') {
                    d3.select('#' + 'forward_button').attr('disabled', null)
                } else {
                    //d3.select('#' + 'forward_button').attr('disabled', 'disabled')
                }
            });
    }

    function chart(transformed_data) {

        keys = Object.keys(transformed_data[0]).filter(x => x !== "parents" && x !== "parent_node_states");

        let svg = d3.select("#chart"),
            margin = {top: 35, left: 200, bottom: 0, right: 30},
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom;

        y = d3.scaleBand()
            .range([margin.top, height - margin.bottom])
            .padding(0.1)
            .paddingOuter(0.2)
            .paddingInner(0.2)

        x = d3.scaleLinear()
            .range([margin.left, width - margin.right])

        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .attr("class", "y-axis")

        svg.append("g")
            .attr("transform", `translate(0,${margin.top})`)
            .attr("class", "x-axis")

        z = d3.scaleSequential().domain([1, keys.length])
            .interpolator(d3.interpolatePuRd);

        update_stackedBarChart(transformed_data, 0, node_under_inv)


    }
}

function update_stackedBarChart(input, speed, node_under_inv) {

    keys = Object.keys(input[0]).filter(x => x !== "parents" && x !== "total" && x !== "index" && x !== "parent_node_states");

    let data = input;
    let svg = d3.select("#chart");

    data.forEach(function (d) {
        d.total = 0;
        d.total = d3.sum(keys, k => +d[k]).toFixed(0)
        return d
    })

    x.domain([0, d3.max(data, d => d.total)]).nice();

    svg.selectAll(".x-axis").transition().duration(speed)
        .call(d3.axisTop(x).ticks(null, "s"))

    y.domain(data.map(d => d.parents));

    z.domain([1, keys.length])

    svg.selectAll(".y-axis").transition().duration(speed)
        .call(d3.axisLeft(y).tickSizeOuter(0))

    let group = svg.selectAll("g.layer")
        .data(d3.stack().keys(keys)(data), d => d.key)

    group.exit().remove()

    group.enter().insert("g", ".y-axis").append("g")
        .classed("layer", true)
        .attr("fill", d => z(keys.indexOf(d.key) + 1))
        .attr('id', function (d) {
            return 'group_' + keys.indexOf(d.key);
        });


    let bars = svg.selectAll("g.layer").selectAll("rect")
        .data(d => d, e => e.data.parents, d => d.key);

    bars.exit().remove()

    bars.enter().append("rect")
        .attr("height", y.bandwidth())
        .merge(bars)
        .transition().duration(speed)
        .attr("y", d => y(d.data.parents))
        .attr("x", d => x(d[0]))
        .attr("width", d => x(d[1]) - x(d[0]))


    d3.selectAll('.layer').each(function (d) {
        let state = keys[this.id.split('group_')[1]];
        d3.select(this).selectAll('rect').each(function (d, i) {
            const instance = this._tippy
            if (instance) {
                instance.destroy();
            }
            tippy(this, {
                content: state+': '+d.data[state].toFixed(0) + '%' ,
            });
        })
    });

    if (speed === 0) {
        setTimeout(() => {

            d3.select('#' + steps_structure_validation_div).selectAll('.stacked_bar_input').remove();
            d3.select('#' + steps_structure_validation_div).selectAll('.header_stacked_bar').remove();

            d3.select('#' + steps_structure_validation_div).selectAll('rect').each(function (d, i) {

                if (i % input.length === 0) {
                    let ref_div = d3.select('#' + steps_structure_validation_div).append('div')
                        .attr('class', 'header_stacked_bar')
                        .style('right', ((keys.length - 1 - Math.floor(i / input.length)) * 65) + 'px')
                        .style('background-color', z(Math.floor(i / input.length) + 1))
                        .style('border', '2px solid '+ z(Math.floor(input.length)))

                    ref_div.append('p')
                        .style('margin', 0)
                        .style('padding-left', 5+'px')
                        .style('color', get_font_color(z(Math.floor(i / input.length) + 1)))
                        .text(keys[Math.floor(i / input.length)].substring(0,3) + '..')

                    const instance = ref_div.node()._tippy
                    if (instance) {
                        instance.destroy();
                    }
                    tippy(ref_div.node(), {
                        content: keys[Math.floor(i / input.length)],
                    });
                }

                let rect_y = parseFloat(d3.select(this).style('height')) / 2 +
                    parseFloat(d3.select(this).style('y')) - 17;

                d3.select('#' + steps_structure_validation_div).append('input')
                    .attr('class', 'stacked_bar_input')
                    .attr('id', keys[Math.floor(i / input.length)] + '___' + i % input.length)
                    .attr('type', 'number')
                    .style('top', rect_y + 'px')
                    .style('right', ((keys.length - 1 - Math.floor(i / input.length)) * 65) + 'px')
                    .attr('value', d.data[keys[Math.floor(i / input.length)]].toFixed(0))
                    .on('input', function () {
                        input[i % input.length][keys[Math.floor(i / input.length)]] = parseFloat(this.value);

                        learned_structure_data.nodes.find(x => x.id === node_under_inv.id)
                            .cpt[d.data.index]
                            .probability.find(x => x.outcome === keys[Math.floor(i / input.length)]).prob = parseFloat(this.value);

                        update_stackedBarChart(input, transition_duration, node_under_inv);
                    });
            })
        }, 10);
    }

    let not_matching_total_inputs = input.filter(x => parseFloat(x.total) !== 100);
    d3.select('#' + steps_structure_validation_div).selectAll('input').style('border', '2px solid #CCCCCC');


    if (not_matching_total_inputs.length>0) {
        d3.select('#' + steps_structure_validation_div).select('.button').attr('disabled', 'disabled');
    } else {
        d3.select('#' + steps_structure_validation_div).select('.button').attr('disabled', null);
    }


    not_matching_total_inputs.forEach(function (d) {
        d3.select('#' + steps_structure_validation_div).selectAll('input').filter(function () {
            return this.id.includes('___'+ d.index);
        }).transition().duration(transition_duration / 2).style('border', '2px solid red');
    })

    setTimeout(() => {
        d3.select('.y-axis').selectAll('.tick').each(function (d, i) {


            for (let j = 0; j< input[i].parent_node_states.length; j++) {
                let text;
                if (j === 0) {
                    text = d3.select(this).select('text').text(input[i].parent_node_states[j].state.substr(0,10) + '...');
                } else {
                    text = d3.select(this).append('text').attr('fill',"currentColor").attr('dy', 0.32+'em').attr('x', -100).text(input[i].parent_node_states[j].state.substr(0,10) + '...');
                }

                const instance = text.node()._tippy
                if (instance) {
                    instance.destroy();
                }
                tippy(text.node(), {
                    content: input[i].parent_node_states[j].state,
                });

                if (i === 0) {
                    text = d3.select('#' + steps_structure_validation_div).append('div')
                        .attr('class', 'header_stacked_bar')
                        .style('left',  (120 - j*100)+ 'px')
                        .append('p')
                        .style('margin', 0)
                        .style('padding-left', 5+'px')
                        .style('color', 'black')
                        .text(input[i].parent_node_states[j].node)

                    const instance = text.node()._tippy
                    if (instance) {
                        instance.destroy();
                    }
                    tippy(text.node(), {
                        content: input[i].parent_node_states[j].node,
                    });
                }
            }

        })
    }, 10);


}


function transform_data_for_stackedBarChart (node_under_inv) {
    let transformed_data = [];

    for (let i = 0; i < node_under_inv.cpt.length; i++) {
        let current_cpt = node_under_inv.cpt[i];

        let data_row = {};
        for (let j = 0; j < current_cpt.probability.length; j++) {
            let current_prob = current_cpt.probability[j];

            data_row[current_prob.outcome] = current_prob.prob * 100
        }

        let parent_node_states = []
        let row_str = "";
        for (let k = 0; k < current_cpt.parents.length; k++) {
            if (k > 0) {
                row_str += "___"
            }
            row_str += current_cpt.parents[k].parent_node + '-' + current_cpt.parents[k].parent_state
            parent_node_states.push({
                node: current_cpt.parents[k].parent_node,
                state: current_cpt.parents[k].parent_state
            })
        }

        data_row.parent_node_states = parent_node_states
        data_row.parents = row_str;
        data_row.index = transformed_data.length;

        transformed_data.push(data_row)
    }

    return transformed_data;
}