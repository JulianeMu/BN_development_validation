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

#pdag <- pc.stable(used_dataset)
#
#list_of_undirected <- undirected.arcs(pdag)
#
## remove undirected edges
#for (i in 1:dim(list_of_undirected)[1]) {
#  pdag <- drop.arc(pdag, from=list_of_undirected[i,][1], to=list_of_undirected[i,][2])
#}
#
#fit <- bn.fit(pdag, used_dataset)


selected_algotithms <- c(

  "pc.stable", "gs", "hc", "tabu", "mmhc", "h2pc"
)


list_test <- list()

for(algorithm in selected_algotithms) try({
  list_test[[algorithm]] <- do.call(
    what = algorithm,
    args = list(x  = used_dataset)
  )

  list_of_undirected <- undirected.arcs(list_test[[algorithm]])

  # remove undirected edges
  for (i in 1:dim(list_of_undirected)[1]) {
    list_test[[algorithm]] <- drop.arc(list_test[[algorithm]], from=list_of_undirected[i,][1], to=list_of_undirected[i,][2])
  }
})

# list_test[[1]]
# graphviz.plot(list_test[[6]])

M_score <- matrix(
  data = NA,
  nrow = length(selected_algotithms),
  ncol = 1,
)
rownames(M_score) <- selected_algotithms
# colnames(M_score) <- names(list_M)
colnames(M_score) <- "test"

for(algorithm in selected_algotithms) for(name in "test") try({
  M_score[algorithm,name] <- score(
    x = list_test[[algorithm]],
    data = used_dataset,
    type = "bic"
  )
})

#for(j in rownames(M_score)) M_score <- M_score[,order(M_score[j,])]
for(j in colnames(M_score)) M_score <- M_score[order(M_score[,j]),]
M_score

which(M_score == max(M_score))
graphviz.plot(list_test[[4]])

best_score <- which(M_score == max(M_score))

fit <- bn.fit(list_test[[best_score]], used_dataset)

write.dsc('bayesianNetworkStructure2.dsc', fit)

# bn.net(fit) to go back to net for later refitting
print("test passed!")

# cat(jsonlite::toJSON(list_final_contributing, pretty=TRUE))
cat(jsonlite::toJSON(TRUE, pretty=TRUE))