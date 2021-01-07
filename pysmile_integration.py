import pysmile
import pysmile_license
import global_variables as gv
import classes


def readin_network_structure():
    gv.network = pysmile.Network()
    gv.network.read_file("bayesianNetworkStructure.dsc")


def get_network_structure():
    nodes = [classes.NodeIdNameOutcomes(id=node_id, label=gv.network.get_node_name(node_id), outcomes=gv.network.get_outcome_ids(node_id))
             for node_id in gv.network.get_all_node_ids()]
    edges = [classes.Edges(edge_from=node_id, edge_to=gv.network.get_child_ids(node_id)) for node_id in gv.network.get_all_node_ids()]

    return classes.NetworkStructure(nodes=nodes, edges=edges)


def get_node_layers():
    # get nodes having no parents to compute the layers
    nodes_having_no_parents = [node_id for node_id in gv.network.get_all_node_ids() if len(gv.network.get_parent_ids(node_id)) == 0]

    list_nodes_information_layers = [classes.LayerObject(id=node_id, name=gv.network.get_node_name(node_id), layer=0,
                                                         outcomes=gv.network.get_outcome_ids(node_id)) for node_id in
                                     gv.network.get_all_node_ids()]

    # compute node layers dependent on causal flow
    for node in nodes_having_no_parents:
        list_nodes_information_layers = recursive_node_layer_computation(gv.network, node, list_nodes_information_layers, 0)

    return list_nodes_information_layers


def recursive_node_layer_computation(net, node_id, list_nodes_information, layer):

    layer = layer + 1
    for child_id in net.get_child_ids(node_id):
        if list_nodes_information[[x.id for x in list_nodes_information].index(child_id)].layer < layer:
            list_nodes_information[[x.id for x in list_nodes_information].index(child_id)].layer = layer
        recursive_node_layer_computation(net, child_id, list_nodes_information, layer)

    return list_nodes_information
