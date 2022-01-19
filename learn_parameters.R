# Title     : TODO
# Objective : TODO
# Created by: julianemuller
# Created on: 13.12.20

library(bnlearn)
library(jsonlite)
library(tidyverse)
source("add_column.R")
source("add_row.R")

myArgs <- commandArgs(trailingOnly = TRUE)

# both dataset and the bayesian network structure need to be loaded:
# myArgs <- commandArgs(trailingOnly = TRUE)

data_file_name <- 'bayesianNetworkStructure.dsc'
data_file_name_csv <- 'whole_data.csv'


used_dataset <- read.csv(file.path(myArgs, data_file_name_csv))
bayesian_network_structure <- bn.net(read.dsc(file.path(myArgs, data_file_name)))

#Changing the dataset into a dataframe with factors as columns
used_dataset[] <- lapply(used_dataset, factor)
#sapply(used_dataset, class)
used_dataset <- as.data.frame(used_dataset)
#typeof(used_dataset)



fit <- bn.fit(bayesian_network_structure, used_dataset)

write.dsc('bayesianNetworkStructure.dsc', fit)

# bn.net(fit) to go back to net for later refitting


# cat(jsonlite::toJSON(list_final_contributing, pretty=TRUE))
cat(jsonlite::toJSON(TRUE, pretty=TRUE))