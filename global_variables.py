import pandas as pd
import pysmile
import pysmile_license

dataset = None
dataset_categorical = pd.DataFrame()
original_data_types = []

subset_selection_included_in_learning = []

whitelist = []
blacklist =[]

network = pysmile.Network()
