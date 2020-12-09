
function initialize_inspect_data_learn_model() {

    query_data_from_FLASK(function (succes) {
        if (succes) {
            initialize_inspect_data_learn_model_view();
        }
    });
}