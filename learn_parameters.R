# Title     : TODO
# Objective : TODO
# Created by: julianemuller
# Created on: 13.12.20

library(bnlearn)
library(jsonlite)

# both dataset and the bayesian network structure need to be loaded:
myArgs <- commandArgs(trailingOnly = TRUE)

bayesian_network_structure <- bn.net(read.dsc(myArgs[1]))

used_dataset <- read.csv(myArgs[2])







fit <- bn.fit(bayesian_network_structure, used_dataset)

write.dsc('bayesianNetworkStructure.dsc', fit)

# bn.net(fit) to go back to net for later refitting


# cat(jsonlite::toJSON(list_final_contributing, pretty=TRUE))
cat(jsonlite::toJSON(TRUE, pretty=TRUE))