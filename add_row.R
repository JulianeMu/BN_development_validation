# Title     : TODO
# Objective : TODO
# Created by: julianemuller
# Created on: 17.01.21

library(bnlearn)
library(jsonlite)
library(tidyverse)

## both dataset and the bayesian network structure need to be loaded:
#myArgs <- commandArgs(trailingOnly = TRUE)
#
#bayesian_network_structure <- bn.net(read.dsc(myArgs[1]))
#
#used_dataset <- read.csv(myArgs[2])
#
##Changing the dataset into a dataframe with factors as columns
#used_dataset[] <- lapply(used_dataset, factor)
#sapply(used_dataset, class)
#used_dataset <- as.data.frame(used_dataset)
##typeof(used_dataset)

add_new_row <- function(data_df, bayesian_network_structure, column_names, added_values) {

  category_status_list <- rep(list("not_specified"), length(names(data_df)))
  names(category_status_list) <- names(data_df)
  is_new_category <- FALSE
  data_added_row <- data_df

  for (nc in c(1:length(column_names))){
    check_levels <- levels(data_added_row %>% pull(column_names[nc]))
    if(!added_values[nc] %in% check_levels){
      category_status_list[column_names[nc]] <- "new_category"
      is_new_category <- TRUE
      lvls <- c(check_levels, added_values[nc])
      data_added_row[column_names[nc]] <- lapply(data_added_row[column_names[nc]], factor, levels=lvls)
    }else{
      category_status_list[column_names[nc]] <- "existed_category"
    }
  }

  # add a row witht the given values
  data_added_row <- data_added_row %>% add_row(!!column_names[1] := added_values[1])
  if(length(column_names) > 1){
    for (nc in c(2:length(column_names))){
      data_added_row[nrow(data_added_row),][column_names[nc]] <- added_values[nc]
    }
  }

  # factorize the data and create a new dataframe
  data_added_row <- lapply(data_added_row, factor)

  # sapply(data_added_row, class)
  data_added_row <- as.data.frame(data_added_row)
  # print(tail(data_added_row))

  # fit the new dataset to the network structure
  fitted = bn.fit(bayesian_network_structure, data_added_row)

  if(!is_new_category){
    # impute the dataset in order to replace the <NA> values
    imputed = impute(fitted, data_added_row)
  }else{
    for (nc in c(1:length(names(category_status_list)))){
      print(names(category_status_list)[nc])
      if(category_status_list[names(category_status_list)[nc]] == "not_specified"){
        data_added_row[nrow(data_added_row),][names(category_status_list)[nc]] <-
          names(which(table(data_added_row[names(category_status_list)[nc]]) ==
                        max(table(data_added_row[names(category_status_list)[nc]]))))
        }
    }
    imputed = data_added_row
  }

  return(list("bayesian_network_parameters" = fitted, "new_imputed_data" = imputed, "data_added_row" = data_added_row,
              "category_status_list" = category_status_list))
}


#fit <- bn.fit(bayesian_network_structure, used_dataset)
#
#write.dsc('bayesianNetworkStructure.dsc', fit)
#
## bn.net(fit) to go back to net for later refitting
#
#
## cat(jsonlite::toJSON(list_final_contributing, pretty=TRUE))
#cat(jsonlite::toJSON(TRUE, pretty=TRUE))