# Title     : TODO
# Objective : TODO
# Created by: julianemuller
# Created on: 13.12.20

library(bnlearn)
library(jsonlite)

myArgs <- commandArgs(trailingOnly = TRUE)

used_dataset <- read.csv(myArgs)

used_dataset[] <- lapply(used_dataset, factor) # convert all columns to factors

# sapply(used_dataset, class)

pdag <- pc.stable(used_dataset)

list_of_undirected <- undirected.arcs(pdag)

# remove undirected edges
for (i in 1:dim(list_of_undirected)[1]) {
  pdag <- drop.arc(pdag, from=list_of_undirected[i,][1], to=list_of_undirected[i,][2])
}

fit <- bn.fit(pdag, used_dataset)

write.dsc('bayesianNetworkStructure.dsc', fit)

# bn.net(fit) to go back to net for later refitting


# cat(jsonlite::toJSON(list_final_contributing, pretty=TRUE))
cat(jsonlite::toJSON(TRUE, pretty=TRUE))