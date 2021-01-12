import json

import jsonpickle
from flask import Flask, request, jsonify, render_template
import time
import pandas as pd
import numpy as np
import os
import subprocess
import simplejson

import pysmile_integration

import global_variables as gv

start_time = time.time()

app = Flask(__name__)


# this creates the json object for more complex structures
def transform(my_object):
    jsonpickle.enable_fallthrough(False)
    jsonpickle.set_preferred_backend('simplejson')
    jsonpickle.set_encoder_options('simplejson', sort_keys=True, ignore_nan=True)
    return jsonpickle.encode(my_object, unpicklable=False)


def is_number(s):
    try:
        complex(s)  # for int, long, float and complex
    except ValueError:
        return False
    return True


@app.route('/get_initial_data/', methods=["GET"])
def get_initial_data():
    start_time_deviations = time.time()

    print("--- %s seconds ---" % (time.time() - start_time_deviations))

    dataset_categorical = gv.dataset_categorical.to_json(orient="records")

    # subset_selection_included_in_learning = json.dumps(gv.subset_selection_included_in_learning)

    return jsonify([dataset_categorical, gv.subset_selection_included_in_learning, gv.whitelist, gv.blacklist])


@app.route('/discretize_data/', methods=["GET"])
def discretize_data():
    start_time_deviations = time.time()

    variables_for_discretization = request.get_json()

    discretized_data = pd.qcut(variables_for_discretization, 4)
    print("--- %s seconds ---" % (time.time() - start_time_deviations))

    return jsonify(transform(discretized_data))


def discretize_variable(variable_for_discretization):
    data_frame = pd.DataFrame()
    data_frame['test'] = variable_for_discretization.tolist()
    discretized_data = pd.qcut(data_frame['test'].rank(method='first'), 4)

    return discretized_data


@app.route('/set_initial_data/', methods=["POST"])
def set_initial_data():
    start_time_deviations = time.time()

    gv.dataset = pd.DataFrame.from_dict(request.get_json()[0])

    gv.subset_selection_included_in_learning = request.get_json()[1]
    gv.whitelist = request.get_json()[2]
    gv.blacklist = request.get_json()[3]

    gv.dataset = gv.dataset.replace("", np.nan)
    gv.dataset_categorical = pd.DataFrame()
    # discretize data
    for (columnName, columnData) in gv.dataset.iteritems():

        list_is_numeric = [is_number(i) for i in columnData.values]
        if False not in list_is_numeric:
            gv.dataset_categorical.insert(loc=len(gv.dataset_categorical.columns), column=columnName,
                                          value=discretize_variable(columnData.values.astype(float)).astype(str))
        else:
            gv.dataset_categorical.insert(loc=len(gv.dataset_categorical.columns), column=columnName,
                                          value=columnData.values)

    gv.initial_groups = []
    gv.learned_structure_data = None

    print("--- %s seconds ---" % (time.time() - start_time_deviations))

    return jsonify(transform(True))


@app.route('/save_data_on_backend/', methods=["POST"])
def save_data_on_backend():
    start_time_deviations = time.time()

    gv.dataset_categorical = pd.DataFrame.from_dict(request.get_json()[0])
    gv.initial_groups = request.get_json()[1]
    gv.subset_selection_included_in_learning = request.get_json()[2]
    gv.whitelist = request.get_json()[3]
    gv.blacklist = request.get_json()[4]
    gv.learned_structure_data = request.get_json()[5]

    print("--- %s seconds ---" % (time.time() - start_time_deviations))

    return jsonify(transform(pysmile_integration.get_network_structure()))


@app.route('/load_data_from_backend/', methods=["GET"])
def load_data_from_backend():
    start_time_deviations = time.time()

    dataset_categorical = gv.dataset_categorical.to_json(orient="records")
    print("--- %s seconds ---" % (time.time() - start_time_deviations))

    return jsonify([dataset_categorical, gv.initial_groups, gv.subset_selection_included_in_learning, gv.whitelist,
                    gv.blacklist, gv.learned_structure_data])


@app.route('/learn_structure_from_data/', methods=["POST"])
def learn_structure_from_data():
    start_time_deviations = time.time()

    gv.subset_selection_included_in_learning = request.get_json()[0]
    gv.whitelist = request.get_json()[1]
    gv.blacklist = request.get_json()[2]

    csv_whitelist_file_name = 'whitelist.csv'
    csv_blacklist_file_name = 'blacklist.csv'
    pd.json_normalize(gv.whitelist).to_csv(csv_whitelist_file_name, index=False)
    pd.json_normalize(gv.blacklist).to_csv(csv_blacklist_file_name, index=False)

    command = 'Rscript'
    path2script = 'learn_structure.R'
    csv_data_file_name = 'whole_data.csv'

    copied_df = gv.dataset_categorical.copy(deep=True)

    for column in gv.subset_selection_included_in_learning:
        if not column['included_in_structural_learning']:
            copied_df = copied_df.drop(column['id'], axis=1)
    copied_df.to_csv(csv_data_file_name, index=False)

    cmd = [command, path2script] + [os.getcwd() + os.path.sep]
    # check_output will run the command and store to result
    x = subprocess.check_output(cmd, universal_newlines=True)
    # x_json = json.loads(x)

    pysmile_integration.readin_network_structure()

    print("--- %s seconds ---" % (time.time() - start_time_deviations))

    return jsonify(transform(pysmile_integration.get_network_structure()))


@app.after_request
def add_headers(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    return response


@app.route('/')
def index():
    """ Displays the index page accessible at '/'
    """
    return render_template("/templates/index.html")


if __name__ == '__main__':
    app.debug = True
    app.run()
    port = 5000  # the custom port you want
    app.run(host='127.0.0.1', port=port)
