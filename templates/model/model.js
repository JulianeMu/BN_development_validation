
const hostURL = "http://127.0.0.1:5000" //"http://localhost:8080";


function export_data_to_FLASK (callback, data) {
    const sURL = hostURL + "/set_initial_data/";

    let values = JSON.stringify(data);

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
            callback(JSON.parse(response));
        }
    });
}