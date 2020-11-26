function initialize_views() {
    d3.select('#' + id_header_text).text(get_language__label_by_id(lang_id_heading_BN_development_validation));
    d3.select('#' + id_main_content).select('.' + id_content).append('p').attr('id', id_intro_text).text(get_language__label_by_id(lang_id_intro));

    const upload_start_open = [{
        id: id_upload_data_svg,
        svg: 'resources/table.svg'
    }, {
        id: id_start_from_scratch_svg,
        svg: 'resources/hand.svg'
    }, {
        id: id_open_session_svg,
        svg: 'resources/open_session.svg'
    }];

    for (let i = 0; i < upload_start_open.length; i++) {
        d3.select('#' + id_main_content).select('.' + id_content).append('svg').attr('id', upload_start_open[i].id).style('width', 33.3 + '%').style('height', 100 + '%');

        d3.xml(upload_start_open[i].svg)
            .then(data => {
                d3.select('#' + id_main_content).select('#' + upload_start_open[i].id).node().append(data.documentElement)

                let transform_x = (d3.select('#' + upload_start_open[i].id).node().getBoundingClientRect().width - parseFloat(d3.select('#' + upload_start_open[i].id).select('svg').attr('width'))) / 2;
                d3.select('#' + upload_start_open[i].id).select('svg').attr('x', transform_x)
            })
    }
}