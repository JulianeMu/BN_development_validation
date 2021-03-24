import json
from copy import copy

import numpy
import pysmile
from scipy.spatial import distance

import pysmile_license
import global_variables as gv
import classes
import re
import pandas as pd


def readin_network_structure():
    gv.network = pysmile.Network()
    gv.network.read_file("bayesianNetworkStructure.dsc")


def save_network_structure():
    gv.network.write_file("bayesianNetworkStructure.dsc")


def node_distinction_computation(node_id):

    list_distinctions = []
    node_handle_for_node_id = 0
    for index in range(0, gv.max_nodes_distinction_amount):  # gv.dataset_categorical.iterrows():

        gv.network.clear_all_evidence()
        gv.network.update_beliefs()
        for node_handle in gv.network.get_all_nodes():

            column = gv.network.get_node_id(node_handle)
            if column != node_id:
                remove_special_chars = re.sub("[^a-zA-Z0-9_.]", "_", gv.dataset_categorical[column][index])
                gv.network.set_evidence(node_handle, remove_special_chars)
            else:
                node_handle_for_node_id = node_handle
            gv.network.update_beliefs()

        index_max_outcome = gv.network.get_node_value(node_id).index(max(gv.network.get_node_value(node_id)))
        if gv.network.get_outcome_ids(node_handle_for_node_id)[index_max_outcome] != gv.dataset_categorical[node_id][
            index]:
            differing_data = pd.DataFrame(columns=gv.dataset_categorical.columns)
            differing_data = differing_data.append(gv.dataset_categorical.iloc[index], ignore_index=True)

            relevancies = []
            target_outcome = gv.network.get_node_value(node_id)

            sum_of_all_overall_relevancies = 0

            for node_handle in gv.network.get_all_nodes():
                column = gv.network.get_node_id(node_handle)
                if column != node_id:
                    net = copy(gv.network)
                    net.update_beliefs()
                    net.clear_evidence(node_handle)
                    net.update_beliefs()

                    overall_relevance_of_evidence_items = compute_jensen_shannon_divergence(net.get_node_value(node_id),
                                                                                            target_outcome)

                    sum_of_all_overall_relevancies += overall_relevance_of_evidence_items
                    relevancies.append(classes.RelevanceObject(evidence_node=column,
                                                               evidence_outcome=re.sub("[^a-zA-Z0-9_.]", "_",
                                                                                       gv.dataset_categorical[column]
                                                                                       [index]),
                                                               relevance=float(overall_relevance_of_evidence_items)))

            for i_rel in range(0, len(relevancies)):
                relevancies[i_rel]['relevance_percentage'] = float(relevancies[i_rel].relevance /
                                                                sum_of_all_overall_relevancies)

            list_distinctions.append(
                classes.DistinctionProbabilitiesAndData(outcomes=gv.network.get_outcome_ids(node_handle_for_node_id),
                                                        df=differing_data,
                                                        probabilities=target_outcome,
                                                        data_outcome=gv.dataset_categorical[node_id][
                                                            index],
                                                        relevancies=relevancies))

    return list_distinctions


def compute_jensen_shannon_divergence(state_1, state_2):
    p1 = state_1
    p2 = state_2

    # for i in range(len(state_1)):
    #     p1.append(float(state_1[i]))
    #    p2.append(float(state_2[i]))

    jen_shan = distance.jensenshannon(p1, p2)

    if numpy.isnan(jen_shan):
        jen_shan = 0

    return jen_shan


def get_cpt(node_id):
    cpt = gv.network.get_node_definition(node_id)
    parents = gv.network.get_parents(node_id)
    dim_count = 1 + len(parents)
    dim_sizes = [0] * dim_count
    for i in range(0, dim_count - 1):
        dim_sizes[i] = gv.network.get_outcome_count(parents[i])
    dim_sizes[len(dim_sizes) - 1] = gv.network.get_outcome_count(node_id)
    coords = [0] * dim_count

    cpts = []
    outcomes_all = gv.network.get_outcome_ids(node_id)

    index_out = 0
    state_objects = []

    for elem_idx in range(0, len(cpt)):

        index_to_coords(elem_idx, dim_sizes, coords)
        outcome = gv.network.get_outcome_id(node_id, coords[dim_count - 1])
        parent_nodes = [classes.CPTParent(gv.network.get_node_id(parents[parent_idx]),
                                          gv.network.get_outcome_id(parents[parent_idx], coords[parent_idx])) for
                        parent_idx in range(0, len(parents))]
        prob = cpt[elem_idx]
        stateobj = classes.StateProb(outcome, prob)
        state_objects.append(stateobj)
        index_out += 1

        if index_out == len(outcomes_all):
            cpts.append(classes.CPT(parent_nodes, state_objects))

            index_out = 0
            state_objects = []

    return cpts


def index_to_coords(index, dim_sizes, coords):
    prod = 1
    for i in range(len(dim_sizes) - 1, -1, -1):
        coords[i] = int(index / prod) % dim_sizes[i]
        prod *= dim_sizes[i]


def update_network_structure():
    if gv.learned_structure_data is not None:

        # remove all arcs in the first place
        for node in gv.learned_structure_data['nodes']:
            for child in gv.network.get_child_ids(node['id']):
                gv.network.delete_arc(node['id'], child)

        # update the edges
        for edge in gv.learned_structure_data['edges']:
            gv.network.add_arc(edge['edge_from'], edge['edge_to'])


def get_network_structure():
    nodes = [classes.NodeIdNameOutcomes(id=node_id, label=gv.network.get_node_name(node_id),
                                        outcomes=[classes.OutcomeIdLabel(outcome, outcome) for outcome in
                                                  gv.network.get_outcome_ids(node_id)],
                                        cpt=get_cpt(node_id),
                                        parents=gv.network.get_parent_ids(node_id),
                                        children=gv.network.get_child_ids(node_id))
             for node_id in gv.network.get_all_node_ids()]

    edges = []
    for node_id in gv.network.get_all_node_ids():
        for node_to_id in gv.network.get_child_ids(node_id):
            try:
                strength = float([x['strength'] for x in gv.learned_structure_strength if
                                  x['from'] == node_id and x['to'] == node_to_id][0])
            except IndexError:
                strength = 1
            edge = classes.Edges(edge_from=node_id, edge_to=node_to_id, edge_strength=strength)
            edges.append(edge)

    return classes.NetworkStructure(nodes=nodes, edges=edges)


def get_node_layers():
    # get nodes having no parents to compute the layers
    nodes_having_no_parents = [node_id for node_id in gv.network.get_all_node_ids() if
                               len(gv.network.get_parent_ids(node_id)) == 0]

    list_nodes_information_layers = [classes.LayerObject(id=node_id, name=gv.network.get_node_name(node_id), layer=0,
                                                         outcomes=gv.network.get_outcome_ids(node_id)) for node_id in
                                     gv.network.get_all_node_ids()]

    # compute node layers dependent on causal flow
    for node in nodes_having_no_parents:
        list_nodes_information_layers = recursive_node_layer_computation(gv.network, node,
                                                                         list_nodes_information_layers, 0)

    return list_nodes_information_layers


def recursive_node_layer_computation(net, node_id, list_nodes_information, layer):
    layer = layer + 1
    for child_id in net.get_child_ids(node_id):
        if list_nodes_information[[x.id for x in list_nodes_information].index(child_id)].layer < layer:
            list_nodes_information[[x.id for x in list_nodes_information].index(child_id)].layer = layer
        recursive_node_layer_computation(net, child_id, list_nodes_information, layer)

    return list_nodes_information
