let data;

function select_file(evt) {

    let files = evt.target.files; // FileList object

    // read files through for loop
    for (let i = 0, f; f = files[i]; i++) {

        let reader = new FileReader();

        reader.onload = (function(theFile) {
            return function(e) {
                console.log(e.target.result);
                console.log(theFile.name);

                d3.csv(e.target.result).then(function(data_csv) {

                    data = data_csv;
                    console.log(data);
                });
            };
        })(f);

        // read files as url
        reader.readAsDataURL(f);
    }
}