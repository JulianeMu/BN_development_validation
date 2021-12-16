
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

    let values = JSON.stringify([subset_selection, whitelist, blacklist]);

    $.ajax({
        url: sURL,
        type: 'POST',
        data: values,
        contentType: "application/json",
        dataType: 'json',
        success: function (response) {
            learned_structure_data = JSON.parse(response);

            console.log(learned_structure_data)
            callback(JSON.parse(response));
        }
    });
}

function learn_parametrization_from_data (callback) {
    const sURL = hostURL + "/learn_parametrization_from_data/";


    $.ajax({
        url: sURL,
        type: 'GET',
        contentType: "application/json",
        dataType: 'json',
        success: function (response) {

            learned_structure_data = JSON.parse(response[0]);

            node_distinction = JSON.parse(response[1]);
            for (let i =0; i< node_distinction.length; i++) {
                for(let j=0; j< node_distinction[i].distinction_probabilities_and_data.length; j++) {
                    node_distinction[i].distinction_probabilities_and_data[j].df = JSON.parse(node_distinction[i].distinction_probabilities_and_data[j].df)
                }
            }

            callback(true);
        }
    });
}

function update_cpt (callback, node_id, indexes, prob) {
    const sURL = hostURL + "/update_cpt/";

    let values = JSON.stringify([node_id, indexes, prob]);

    $.ajax({
        url: sURL,
        type: 'POST',
        data: values,
        contentType: "application/json",
        dataType: 'json',
        success: function (response) {
            //data = JSON.parse(response);

            learned_structure_data = JSON.parse(response[0]);

            node_distinction = JSON.parse(response[1]);
            for (let i =0; i< node_distinction.length; i++) {
                for(let j=0; j< node_distinction[i].distinction_probabilities_and_data.length; j++) {
                    node_distinction[i].distinction_probabilities_and_data[j].df = JSON.parse(node_distinction[i].distinction_probabilities_and_data[j].df)
                }
            }

            callback(true);
        }
    });
}

function compute_chi_square (callback, node_id) {
    const sURL = hostURL + "/compute_chi_square/";

    let values = JSON.stringify(node_id);

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

function save_data_on_backend (callback) {
    const sURL = hostURL + "/save_data_on_backend/";

    let save_data = [data, initial_groups, subset_selection, whitelist, blacklist, learned_structure_data]
    let values = JSON.stringify(save_data);

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

function load_data_from_backend (callback) {
    const sURL = hostURL + "/load_data_from_backend/";

    $.ajax({
        url: sURL,
        type: 'GET',
        contentType: "application/json",
        dataType: 'json',
        success: function (response) {
            data = JSON.parse(response[0]);

            if (response[1].length > 0) {
                initial_groups = response[1];
            }

            if (response[2].length > 0) {
                subset_selection = response[2];
            }

            if (response[3].length > 0) {
                whitelist = response[3];
            }

            if (response[4].length > 0) {
                blacklist = response[4];
            }

            if (response[5] !== null) {
                learned_structure_data = response[5];
                learned_structure_data_without_modifications = response[5];

            }

            callback(true);
        }
    });
}

function export_progress() {
    let save_data = [data, initial_groups, subset_selection, whitelist, blacklist, learned_structure_data]
    let values = JSON.stringify(save_data);

    let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(values);

    let exportFileDefaultName = 'BN_generation_and_validation_progress.json';

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

function import_progress() {
    data = JSON.parse(response[0]);

    if (response[1].length > 0) {
        initial_groups = response[1];
    }

    if (response[2].length > 0) {
        subset_selection = response[2];
    }

    if (response[3].length > 0) {
        whitelist = response[3];
    }

    if (response[4].length > 0) {
        blacklist = response[4];
    }

    if (response[5].length !== null) {
        learned_structure_data = response[5];
    }
}