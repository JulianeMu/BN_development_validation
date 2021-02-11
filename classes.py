
class LayerObject(object):
    def __init__(self, id, name, layer, outcomes):
        self.id = id
        self.name = name
        self.layer = layer
        self.outcomes = outcomes


class Chi2PValue(object):
    def __init__(self, node_id, p_value):
        self.node_id = node_id
        self.p_value = p_value


class OutcomeIdLabel(object):
    def __init__(self, id, label):
        self.id = id
        self.label = label
        self.original = True


class NodeIdNameOutcomes(object):
    def __init__(self, id, label, outcomes, parents, children):
        self.id = id
        self.label = label
        self.outcomes = outcomes
        self.parents = parents
        self.children = children
        self.structure_validated = False
        self.cpt_validated = False
        self.notes_comments = ""
        self.data_type = ""


class Edges(object):
    def __init__(self, edge_from, edge_to, edge_strength):
        self.edge_from = edge_from
        self.edge_to = edge_to
        self.edge_strength = edge_strength


class NetworkStructure(object):
    def __init__(self, nodes, edges):
        self.nodes = nodes
        self.edges = edges
########################################################################


class StateObject(object):
    def __init__(self, name, probability):
        self.name = name
        self.probability = probability


class VirtualEvidenceObject(object):
    def __init__(self, id_, values):
        self.id = id_
        self.values = values


class ObservableNodeIdsAndObserved(object):
    def __init__(self, id_, name, is_evidence, is_virtual_evidence):
        self.node_id = id_
        self.node_name = name
        self.is_evidence = is_evidence
        self.is_virtual_evidence = is_virtual_evidence


class NodeIDWithStateObjects(object):
    def __init__(self, nodeid, state_objects):
        self.nodeid = nodeid
        self.stateObjects = state_objects


class RelevanceOfEvidenceObject(object):
    def __init__(self, node_id, node_label, states, overall_relevance, relevancies, lines, point, is_virtual_evidence,
                 resulting_in_max_state_change, max_state_with_current_evidence, max_state_without_current_evidence,
                 is_observed):
        self.node_id = node_id
        self.lines = lines
        self.node_label = node_label
        self.states = states
        self.overall_relevance = overall_relevance
        self.relevancies = relevancies
        self.point = point
        self.is_virtual_evidence = is_virtual_evidence
        self.resulting_in_max_state_change = resulting_in_max_state_change
        self.max_state_with_current_evidence = max_state_with_current_evidence
        self.max_state_without_current_evidence = max_state_without_current_evidence
        self.isObserved = is_observed


class PointObject(object):
    def __init__(self, index, relevance, x):
        self.index = index
        self.relevance = relevance
        self.x = x


class RelevanceObject(object):
    def __init__(self, state, relevance):
        self.state = state
        self.relevance = relevance


class LinesObject(object):
    def __init__(self, x0, x1, relevance0, relevance1):
        self.x0 = x0
        self.x1 = x1
        self.relevance0 = relevance0
        self.relevance1 = relevance1


class CaseObject(object):
    def __init__(self, name, evidences):
        self.name = name
        self.evidences = evidences


class ServiceEvidenceCases(object):
    def __init__(self, cases):
        self.cases = cases


class NodeIdsVirtualEvidenceObject(object):
    def __init__(self, node_ids, virtual_evidence_objects):
        self.node_ids = node_ids
        self.virtualEvidenceObjects = virtual_evidence_objects


class NodeObjectMultipleStatesLong(object):
    def __init__(self, id, name, index, states, is_observed, children_ids, parents_ids):
        self.id = id
        self.name = name
        self.index = index
        self.states = states
        self.isObserved = is_observed
        self.children_ids = children_ids
        self.parents_ids = parents_ids


class NodeObjectMultipleStates(object):
    def __init__(self, id_, name, is_observed, states):
        self.id = id_
        self.name = name
        self.isObserved = is_observed
        self.states = states