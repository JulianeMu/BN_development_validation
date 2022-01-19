# Title     : TODO
# Objective : TODO
# Created by: julianemuller
# Created on: 13.12.20

library(bnlearn)
library(jsonlite)

myArgs <- commandArgs(trailingOnly = TRUE)


data_file_name <- 'whole_data.csv'
whitelist_file_name <- 'whitelist.csv'
blacklist_file_name <- 'blacklist.csv'

used_dataset <- read.csv(file.path(myArgs, data_file_name)) #paste0(myArgs, data_file_name))

whitelist <- NULL
blacklist <- NULL

#if (file.size(paste0(myArgs, whitelist_file_name)) > 1) {
if (file.size(file.path(myArgs, whitelist_file_name)) > 1) {
  whitelist <- read.csv(file.path(myArgs, whitelist_file_name))
}

if (file.size(file.path(myArgs, blacklist_file_name)) > 1) {
  blacklist <- read.csv(file.path(myArgs, blacklist_file_name))
}

used_dataset[] <- lapply(used_dataset, factor) # convert all columns to factors

# sapply(used_dataset, class)

#write.csv(used_dataset,'used_dataset.csv')
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

# list of the algorithms to check
selected_algotithms <- c(
  "pc.stable", "gs", "hc", "tabu", "mmhc", "h2pc"
)

method <- "first"

#----------first way of estimating the structure------------
if(method == "first"){

  # list of all the models
  list_test <- list()
  # list of all the strength values for each model
  list_strength <- list()

  for(algorithm in selected_algotithms) try({
    list_test[[algorithm]] <- do.call(
      what = algorithm,
      args = list(x  = used_dataset, whitelist = whitelist, blacklist = blacklist)
    )
    # find all undirected edges
    list_of_undirected <- undirected.arcs(list_test[[algorithm]])

    # if there are undirected arcs
    if(dim(list_of_undirected)[1] > 0){
      # remove undirected edges
      for (i in 1:dim(list_of_undirected)[1]) {
        list_test[[algorithm]] <- drop.arc(list_test[[algorithm]], from=list_of_undirected[i,][1], to=list_of_undirected[i,][2])
      }
    }

    # calculate the strength of arcs
    list_strength[[algorithm]] <- arc.strength(
      x = list_test[[algorithm]],
      data = used_dataset
    )
    #print(list_strength[[algorithm]])
    list_strength[[algorithm]]$strength <- list_strength[[algorithm]]$strength/min(list_strength[[algorithm]]$strength)
    list_strength[[algorithm]] <- list_strength[[algorithm]][order(list_strength[[algorithm]]$strength),]

  })

}



#----------second way of estimating the structure------------
# This method does not support whitelist and blacklist
if(method == "second"){
  # list of all the models
  list_test <- list()
  # list of all the strength values for each model
  list_strength <- list()

  for(algorithm in selected_algotithms) try({
    list_strength[[algorithm]] <- do.call(
      what = boot.strength,
      args = list(data  = used_dataset, R = 200, algorithm = algorithm,
                  algorithm.args = list(whitelist = whitelist, blacklist = blacklist))
    )

    # var1: get the threshold from attributes
    th <- attr(list_strength[[algorithm]], "threshold")

    # var2: set the threshold
    #th <- 0.45

    # calculate averaged network structure
    list_test[[algorithm]] <- averaged.network(list_strength[[algorithm]], threshold = th)
    # only keep the strength values for arc with bigger strength than the threshold
    list_strength[[algorithm]] <- list_strength[[algorithm]][c(which(list_strength[[algorithm]]$strength > th)),]
    # find all undirected edges
    list_of_undirected <- undirected.arcs(list_test[[algorithm]])

    # if there are undirected arcs
    if(dim(list_of_undirected)[1] > 0){
      # remove undirected edges
      for (i in 1:dim(list_of_undirected)[1]) {
        list_test[[algorithm]] <- drop.arc(list_test[[algorithm]], from=list_of_undirected[i,][1], to=list_of_undirected[i,][2])
      }
    }

    # calculate the strength of arcs
    #list_strength[[algorithm]] <- arc.strength_data <- arc.strength(
    #  x = list_test[[algorithm]],
    #  data = used_dataset
    #)
    #print(list_strength[[algorithm]])

  })
}

# list_test[[1]]
# graphviz.plot(list_test[[6]])

# a list of scores for each algorithm
M_score <- matrix(
  data = NA,
  nrow = length(selected_algotithms),
  ncol = 1,
)
rownames(M_score) <- selected_algotithms
colnames(M_score) <- "score"

for(algorithm in selected_algotithms) for(name in "score") try({
  M_score[algorithm,name] <- score(
    x = list_test[[algorithm]],
    data = used_dataset,
    type = "bic"
  )
})

# sort the score array
for(j in colnames(M_score)) M_score <- M_score[order(M_score[,j]),]

# find the highest score(indicating the best algorithm)
best_score <- which(M_score == max(M_score))[1] # use first one because it could be that there are multiple best ones

fit <- bn.fit(list_test[[best_score]], used_dataset)

write.dsc('bayesianNetworkStructure.dsc', fit)

# bn.net(fit) to go back to net for later refitting


cat(jsonlite::toJSON(list_strength[[best_score]], pretty=TRUE))
