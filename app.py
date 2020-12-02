import json

import jsonpickle
from flask import Flask, request, jsonify, render_template
import time
import pandas as pd

import global_variables as gv


start_time = time.time()

app = Flask(__name__)


# this creates the json object for more complex structures
def transform(my_object):
    jsonpickle.enable_fallthrough(False)
    jsonpickle.set_preferred_backend('simplejson')
    jsonpickle.set_encoder_options('simplejson', sort_keys=True, ignore_nan=True)
    return jsonpickle.encode(my_object, unpicklable=False)


@app.route('/set_initial_data/', methods=["POST"])
def set_initial_data():
    start_time_deviations = time.time()

    gv.dataset = pd.DataFrame.from_dict(request.get_json())

    print("--- %s seconds ---" % (time.time() - start_time_deviations))

    return jsonify(transform(True))


@app.route('/get_initial_data/', methods=["GET"])
def get_initial_data():
    start_time_deviations = time.time()

    print("--- %s seconds ---" % (time.time() - start_time_deviations))

    result = gv.dataset.to_json(orient="records")
    parsed = json.loads(result)
    json.dumps(parsed, indent=4)
    return jsonify(result)


@app.route('/discretize_data/', methods=["GET"])
def discretize_data():
    start_time_deviations = time.time()

    variables_for_discretization = request.get_json()

    discretized_data = pd.qcut(variables_for_discretization, 4)
    print("--- %s seconds ---" % (time.time() - start_time_deviations))

    return jsonify(transform(discretized_data))


def discretize_variable():
    return True


@app.after_request
def add_headers(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    return response


@app.route('/')
def index():
    """ Displays the index page accessible at '/'
    """
    return render_template("index.html")


if __name__ == '__main__':
    app.debug = True
    app.run()
    port = 5000  # the custom port you want
    app.run(host='127.0.0.1', port=port)
