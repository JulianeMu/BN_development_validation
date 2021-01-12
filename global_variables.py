import pandas as pd
import pysmile
import pysmile_license

dataset = None
dataset_categorical = pd.DataFrame()
original_data_types = []
initial_groups = []

subset_selection_included_in_learning = []

whitelist = []
blacklist = []
learned_structure_data = []

network = pysmile.Network()
