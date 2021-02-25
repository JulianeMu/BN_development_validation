# Title     : TODO
# Objective : TODO
# Created by: gbehn
# Created on: 2/23/2021

library(bnlearn)
library(jsonlite)
library(tidyverse)

myArgs <- commandArgs(trailingOnly = TRUE)

learned_structure_file_name <- 'bayesianNetworkStructure.dsc'
validated_structure_file_name <- 'bayesianNetworkStructure.dsc' # TODO: add the name of the actual file

bayesian_network_structure_learned <- bn.net(read.dsc(paste0(myArgs, learned_structure_file_name)))
bayesian_network_structure_validated <- bn.net(read.dsc(paste0(myArgs, validated_structure_file_name)))

structural_differences <- function(bayesian_network_structure_learned, bayesian_network_structure_validated){

  if (all.equal(bayesian_network_structure_learned, bayesian_network_structure_validated) == TRUE){

    return(list("equal" = TRUE,
                "hamming_distance" = hamming(bayesian_network_structure_learned, bayesian_network_structure_validated,
                                             debug = FALSE),
                "shd" = shd(bayesian_network_structure_learned, bayesian_network_structure_validated, wlbl = FALSE,
                            debug = FALSE)
    ))

  }else{

    return(list("equal" = FALSE,
                "differences_description" = all.equal(bayesian_network_structure_learned,
                                                      bayesian_network_structure_validated),
                "differences_count" = compare(bayesian_network_structure_learned, bayesian_network_structure_validated,
                                              arcs = FALSE),
                "differences_arcs" = compare(bayesian_network_structure_learned, bayesian_network_structure_validated,
                                             arcs = TRUE),
                "hamming_distance" = hamming(bayesian_network_structure_learned, bayesian_network_structure_validated,
                                             debug = FALSE),
                "shd" = shd(bayesian_network_structure_learned, bayesian_network_structure_validated, wlbl = FALSE,
                            debug = FALSE)
    ))
  }

}

