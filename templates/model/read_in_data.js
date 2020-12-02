function select_file(evt) {

    let files = evt.target.files; // FileList object

    // read files through for loop
    for (let i = 0, f; f = files[i]; i++) {

        let reader = new FileReader();

        reader.onload = (function() {
            return function(e) {

                d3.csv(e.target.result).then(function(data_csv) {

                    // remove row names having no header
                    data_csv.forEach(element => delete element[""]);

                    export_data_to_FLASK(function (callback){
                        if(callback) {
                            current_html_page = 1;
                            transitionToPage(html_pages[current_html_page]);
                        }
                    }, data_csv);


                });
            };
        })(f);

        // read files as url
        reader.readAsDataURL(f);
    }
}