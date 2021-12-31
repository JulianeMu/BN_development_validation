
function footer_forward_button() {
    current_html_page = current_html_page + 1;
    save_data_on_backend(function () {
        transitionToPage(html_pages[current_html_page]);
    });
}

function get_font_color(color) {
    // in case the luminance is bright, use black font color, otherwise white
    let d3color = d3.color(color);
    let luminance = 0.2126 * d3color.r + 0.7152 * d3color.g + 0.0722 * d3color.b;

    let font_color = 'white';
    if (luminance > 50) {
        font_color = '#444168';
    }

    return font_color;
}