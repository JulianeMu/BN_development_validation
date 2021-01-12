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

const background_color = color_clinical_workflow_groups(1); //'#BADCCA';

function initialize_header(label_id) {

    d3.select('#' + id_header_text).text(get_language__label_by_id(label_id));
    d3.select('#' + id_heading).style('background-color', background_color);

    d3.select('.' + id_header_save_button).on('click', header_save_button);
    d3.select('.' + id_header_back_button).on('click', header_backwards_button);

    tippy('.' + id_header_save_button, {
        content: get_language__label_by_id(lang_id_tooltip_header_save),
        appendTo: 'parent',
    });

    tippy('.' + id_header_back_button, {
        content: get_language__label_by_id(lang_id_tooltip_header_backwards),
        appendTo: 'parent',
    });
}

function header_backwards_button() {
    current_html_page = current_html_page - 1;
    transitionToPage(html_pages[current_html_page]);
}

function header_save_button() {
    console.log('save');
}