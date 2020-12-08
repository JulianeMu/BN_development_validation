const header_buttons = [{
    id: id_header_back_button,
    svg: 'resources/back.svg',
    lower: true,
    function: header_backwards_button
}, {
    id: id_header_save_button,
    svg: 'resources/save.svg',
    lower: false,
    function: header_save_button
}];

const background_color = '#BADCCA';

function initialize_header() {

    d3.select('#' + id_header_text).text(get_language__label_by_id(lang_id_inspect_data_learn_structure));
    d3.select('#' + id_heading).style('background-color', background_color);

    d3.select('#' + id_header_save_button).on('click', header_save_button);
    d3.select('#' + id_header_back_button).on('click', header_backwards_button);

}

function header_backwards_button() {
    current_html_page = current_html_page - 1;
    transitionToPage(html_pages[current_html_page]);
}

function header_save_button() {
    console.log('save');
}