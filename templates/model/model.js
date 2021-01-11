
const hostURL = "http://127.0.0.1:5000" //"http://localhost:8080";


function export_data_to_FLASK (callback, data) {
    const sURL = hostURL + "/set_initial_data/";

    let columns = Object.keys(data[0]);

    columns.forEach(function (col) {
        subset_selection.push({
            id: col,
            subset_selection: [],
            included_in_structural_learning: true
        })
    })

    let values = JSON.stringify([data, subset_selection, whitelist, blacklist]);

    $.ajax({
        url: sURL,
        type: 'POST',
        data: values,
        contentType: "application/json",
        dataType: 'json',
        success: function (response) {


            callback(JSON.parse(response));
        }
    });
}

function query_data_from_FLASK (callback) {
    const sURL = hostURL + "/get_initial_data/";

    $.ajax({
        url: sURL,
        type: 'GET',
        contentType: "application/json",
        dataType: 'json',
        success: function (response) {
            data = JSON.parse(response[0]);
            subset_selection = response[1];
            whitelist = response[2];
            blacklist = response[3];
            callback(true);
        }
    });
}

function learn_structure_from_data (callback) {
    const sURL = hostURL + "/learn_structure_from_data/";

    console.log(subset_selection)
    let values = JSON.stringify([subset_selection, whitelist, blacklist]);
    //let values = JSON.stringify(data);

    $.ajax({
        url: sURL,
        type: 'POST',
        data: values,
        contentType: "application/json",
        dataType: 'json',
        success: function (response) {
            //data = JSON.parse(response);
            callback(JSON.parse(response));
        }
    });
}