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
from scipy.stats import chi2_contingency
import classes

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

    dataset_categorical = gv.dataset_categorical.to_json(orient="records")

    # subset_selection_included_in_learning = json.dumps(gv.subset_selection_included_in_learning)
    print("--- %s seconds ---" % (time.time() - start_time_deviations))

    return jsonify([dataset_categorical, gv.subset_selection_included_in_learning, gv.whitelist, gv.blacklist])


@app.route('/discretize_data/', methods=["GET"])
def discretize_data():
    start_time_deviations = time.time()

    variables_for_discretization = request.get_json()

    discretized_data = pd.qcut(variables_for_discretization, 4)
    print("--- %s seconds ---" % (time.time() - start_time_deviations))

    return jsonify(transform(discretized_data))


@app.route('/compute_chi_square/', methods=["GET"])
def compute_chi_square():
    start_time_deviations = time.time()

    # variables_for_chi_square_test = request.get_json()

    list_chi2 = []
    for index, node in enumerate(gv.subset_selection_included_in_learning):
        if node['included_in_structural_learning']:
            for index2, node2 in enumerate(gv.subset_selection_included_in_learning):
                if index2 > index and node2['included_in_structural_learning']:
                    list_chi2.append(compute_chi2_in_loop(node2['id'], node['id']))

    # list_chi2 = [[compute_chi2_in_loop(node2['id'], node['id']) for node2 in
    #              gv.subset_selection_included_in_learning if node['included_in_structural_learning']
    #              and node['id'] != node2['id']]
    #             for node in
    #             gv.subset_selection_included_in_learning if node['included_in_structural_learning']]

    #print(len(list_test))
    print(len(list_chi2))
    print("--- %s seconds ---" % (time.time() - start_time_deviations))

    return jsonify(transform(list_chi2))


def compute_chi2_in_loop(node1, node2):
    data_crosstab = pd.crosstab(gv.dataset_categorical[node1],
                                gv.dataset_categorical[node2],
                                margins=False)

    crosstab_rows_list = data_crosstab.values.tolist()

    return classes.Chi2PValue(node_id=node2, node_id_2=node1, p_value=float(chi2_contingency(crosstab_rows_list)[1]))


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

    pysmile_integration.update_network_structure()
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

    cmd = [command, path2script] + [correct_file_sep_for_windows(os.getcwd())]

    #cmd = [command, path2script] + [os.getcwd() + os.path.sep]

    # check_output will run the command and store to result
    x = subprocess.check_output(cmd, universal_newlines=True)

    x_json = json.loads(x)
    # print(x_json[0]['from'])
    gv.learned_structure_strength = x_json

    pysmile_integration.readin_network_structure()

    print("--- %s seconds ---" % (time.time() - start_time_deviations))

    return jsonify(transform(pysmile_integration.get_network_structure()))


def correct_file_sep_for_windows(path_string):
    return path_string.replace("\\", "\\")


@app.route('/learn_parametrization_from_data/', methods=["GET"])
def learn_parametrization_from_data():
    start_time_deviations = time.time()

    pysmile_integration.save_network_structure()

    command = 'Rscript'
    path2script = 'learn_parameters.R'
    #cmd = [command, path2script] + [os.getcwd() + os.path.sep]
    cmd = [command, path2script] + [correct_file_sep_for_windows(os.getcwd())]
    print(cmd)

    # check_output will run the command and store to result
    x = subprocess.check_output(cmd, universal_newlines=True)
    x_json = json.loads(x)

    pysmile_integration.readin_network_structure()

    list_nodes_distinction_probabilities = [classes.NodesDistinctionProbabilities
                                            (distinction_probabilities_and_data=
                                             pysmile_integration.node_distinction_computation(column), id=column) for
                                            column in gv.dataset_categorical]
    print("--- %s seconds ---" % (time.time() - start_time_deviations))

    return jsonify([transform(pysmile_integration.get_network_structure()), transform(list_nodes_distinction_probabilities)])


@app.route('/update_cpt/', methods=["POST"])
def update_cpt():
    start_time_deviations = time.time()
    node_id = request.get_json()[0]
    indexes = request.get_json()[1]
    prob = request.get_json()[2]

    pysmile_integration.update_cpt(node_id=node_id, indexes=indexes, prob=prob)

    list_nodes_distinction_probabilities = [classes.NodesDistinctionProbabilities
                                            (distinction_probabilities_and_data=
                                             pysmile_integration.node_distinction_computation(column), id=column) for
                                            column in gv.dataset_categorical]
    print("--- %s seconds ---" % (time.time() - start_time_deviations))

    return jsonify([transform(pysmile_integration.get_network_structure()), transform(list_nodes_distinction_probabilities)])

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:63342')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
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
