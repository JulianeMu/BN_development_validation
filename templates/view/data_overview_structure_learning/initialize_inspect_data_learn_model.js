const opacity_when_hidden = 0.6;

let integrate_white_list_black_list = id_whitelist_button;

function initialize_inspect_data_learn_model_view() {

    let content_div = d3.select('#' + id_main_content).select('.' + id_content);

    initialize_data_inspection_view(content_div);
    initialize_model_learning_view(content_div);

    d3.select('#' + id_main_content).style('height', content_div.style('height'))
}


function initialize_model_learning_view(content_div) {

    let structure_learning_div = content_div.append('div')
        .attr('id', id_learnt_model_div)
        .style('padding-top', 20 + 'px')
        .style('padding-bottom', 20 + 'px');


    initialize_prior_knowledge_view(structure_learning_div);

    initialize_structural_learning_view (structure_learning_div);

}



