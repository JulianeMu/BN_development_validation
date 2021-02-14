
function footer_forward_button() {
    current_html_page = current_html_page + 1;
    save_data_on_backend(function () {
        transitionToPage(html_pages[current_html_page]);
    });
}