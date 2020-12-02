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

    for (let i = 0; i < header_buttons.length; i++) {
        d3.xml(header_buttons[i].svg)
            .then(data => {

                data.documentElement.id = header_buttons[i].id;

                d3.select('#' + id_heading).select('.' + id_content).node().append(data.documentElement)

                let translate_y = -35;

                if (header_buttons[i].lower) {
                    d3.select('#' + id_heading).select('.' + id_content).select('#' + header_buttons[i].id).lower()
                        .attr('width', 34.67 + 'px');
                    translate_y = -1 * translate_y;
                }

                d3.select('#' + id_heading).select('.' + id_content).select('#' + header_buttons[i].id)
                    .attr('height', 28 + 'px')
                    .style('float', function () {
                        if (!header_buttons[i].lower) {
                            return 'right';
                        }
                    })
                    .attr('transform', 'translate(' + 0 + ', ' + translate_y + ')')
                    .on('click', header_buttons[i].function);
            })
    }

    d3.select('#' + id_header_text).text(get_language__label_by_id(lang_id_inspect_data_learn_structure));

    d3.select('#' + id_heading).style('background-color', background_color);
}

function header_backwards_button() {
    current_html_page = current_html_page - 1;
    transitionToPage(html_pages[current_html_page]);
}

function header_save_button() {
    console.log('save');
}