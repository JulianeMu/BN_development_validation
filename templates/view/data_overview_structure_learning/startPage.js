
const upload_start_open = [{
    id: id_upload_data_svg,
    svg: 'resources/table.svg',
    button_text: lang_id_upload_data,
    user_input: true,
    function: upload_data_func
}, {
    id: id_start_from_scratch_svg,
    svg: 'resources/hand.svg',
    button_text: lang_id_startScratch,
    user_input: false,
    function: start_from_scratch_func
}, {
    id: id_open_session_svg,
    svg: 'resources/open_session.svg',
    button_text: lang_id_openSession,
    user_input: false,
    function: open_session_func
}];

function initialize_startPage() {
    d3.select('#' + id_header_text).text(get_language__label_by_id(lang_id_heading_BN_development_validation));
    d3.select('#' + id_main_content).select('.' + id_content).append('p').attr('id', id_intro_text).text(get_language__label_by_id(lang_id_intro));

    const div_width = 33.3;

    for (let i = 0; i < upload_start_open.length; i++) {

        d3.select('#' + id_main_content).select('.' + id_content).append('div')
            .attr('id', upload_start_open[i].id)
            .style('width', div_width + '%')
            .style('height', 100 + '%').style('position', 'absolute')
            .style('left', 'calc(' + i +' * ' + div_width + '%)')
            .append('svg').style('width', 100 + '%').style('height', 100 + '%');

        if (upload_start_open[i].user_input) {
            d3.select('#' + id_main_content).select('#' + upload_start_open[i].id).append('input')
                .attr('type', 'file')
                .attr('id', id_upload_file_hidden_button)
                .style('display', 'none')
                .attr('size', "1") // only one file is allowed
                .attr('accept', '.csv') // only csv files are allowed
                .on('change', select_file);
        }

        d3.select('#' + id_main_content).select('#' + upload_start_open[i].id).append('button')
            .attr('class', id_class_button)
            .text(get_language__label_by_id(upload_start_open[i].button_text)).style('left', 50 + '%')
            .style('transform', 'translate(-50%, 0)')
            .on('click', upload_start_open[i].function);

        d3.xml(upload_start_open[i].svg)
            .then(data => {
                d3.select('#' + id_main_content).select('#' + upload_start_open[i].id).select('svg').node().append(data.documentElement)

                let transform_x = (d3.select('#' + upload_start_open[i].id).select('svg').node().getBoundingClientRect().width - parseFloat(d3.select('#' + upload_start_open[i].id).select('svg').select('svg').attr('width'))) / 2;
                d3.select('#' + upload_start_open[i].id).select('svg').attr('transform', 'translate(' +transform_x + ', 100)')
                    .on('click', upload_start_open[i].function);
            })
    }
}

function upload_data_func () {
    document.getElementById(id_upload_file_hidden_button).click();
}

function start_from_scratch_func () {

}

function open_session_func () {

}