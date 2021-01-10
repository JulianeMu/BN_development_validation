# Title     : TODO
# Objective : TODO
# Created by: julianemuller
# Created on: 13.12.20

library(bnlearn)
library(jsonlite)
library(tidyverse)

# both dataset and the bayesian network structure need to be loaded:
myArgs <- commandArgs(trailingOnly = TRUE)

bayesian_network_structure <- bn.net(read.dsc(myArgs[1]))

used_dataset <- read.csv(myArgs[2])

#Changing the dataset into a dataframe with factors as columns
used_dataset[] <- lapply(used_dataset, factor)
sapply(used_dataset, class)
used_dataset <- as.data.frame(used_dataset)
#typeof(used_dataset)

#function to add a randomized column with predefined categries as a list
add_random_column <- function(data_df, bayesian_network_structure, added_column_name, categories_of_added_column) {

  data_added_node <- data_df
  #create a random column with the given categories and the same probability
  #with this method(sample) the output won't be exactly the same probability for each category but close
  randomly_created_column <- sample(categories_of_added_column, nrow(data_added_node), replace=TRUE,
                                    prob=c(1:length(categories_of_added_column)) * 0 + 1/length(categories_of_added_column))

  # prop.table(table(randomly_created_column))

  data_added_node[added_column_name] <- randomly_created_column
  #after changing the dataset, we need to set it as factor and change it to a dataframe again
  data_added_node <- lapply(data_added_node, factor)
  sapply(data_added_node, class)
  data_added_node <- as.data.frame(data_added_node)

  #add the column/node to our network structure as well
  model <- bayesian_network_structure
  model = add.node(model, added_column_name)

  #fit the model to the new dataset
  new_bayesian_network_structure = bn.fit(model, data_added_node)

  # return the new structure and modified dataset
  return(list("new_bayesian_network_structure" = new_bayesian_network_structure, "data_added_node" = data_added_node))

}

#output <- add_random_column(used_dataset, bayesian_network_structure, "new_category", c("a", "b", "c", "d", "e"))

# add function to add new category/row and fill the rest of the values with impute function
add_new_row <- function(data_df, bayesian_network_structure, column_names, added_values) {

  data_added_row <- data_df
  # tail(data_added_row)
  # nrow(data_added_row)
  # add a row with the given values
  data_added_row <- data_added_row %>% add_row(!!column_names[1] := added_values[1])
  if(length(column_names) > 1){
    for (nc in c(2:length(column_names))){
      print(nc)
      data_added_row[nrow(data_added_row),][column_names[nc]] <- added_values[nc]
    }
  }

  # print(tail(data_added_row))
  # factorize the data and create a new dataframe
  data_added_row <- lapply(data_added_row, factor)
  #sapply(data_added_row, class)
  data_added_row <- as.data.frame(data_added_row)
  # print(tail(data_added_row))

  # fit the new dataset to the network structure
  fitted = bn.fit(bayesian_network_structure, data_added_row)
  # impute the dataset in order to replace the <NA> values
  imputed = impute(fitted, data_added_row)

  # graphviz.plot(fitted3)
  # tail(imputed3)
  return(list("bayesian_network_parameters" = fitted, "new_imputed_data" = imputed))

}

#output2 <- add_new_row(used_dataset, bayesian_network_structure, "health", "yes")

fit <- bn.fit(bayesian_network_structure, used_dataset)

write.dsc('bayesianNetworkStructure.dsc', fit)

# bn.net(fit) to go back to net for later refitting


# cat(jsonlite::toJSON(list_final_contributing, pretty=TRUE))
cat(jsonlite::toJSON(TRUE, pretty=TRUE))