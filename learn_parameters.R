# Title     : TODO
# Objective : TODO
# Created by: julianemuller
# Created on: 13.12.20

library(bnlearn)
library(jsonlite)

myArgs <- commandArgs(trailingOnly = TRUE)

bayesian_network_structure <- bn.net(read.dsc(myArgs))


fit <- bn.fit(bayesian_network_structure, used_dataset)

write.dsc('bayesianNetworkStructure.dsc', fit)

# bn.net(fit) to go back to net for later refitting


# cat(jsonlite::toJSON(list_final_contributing, pretty=TRUE))
cat(jsonlite::toJSON(TRUE, pretty=TRUE))