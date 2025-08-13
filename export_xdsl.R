# Title     : TODO
# Objective : TODO
# Created by: julianemuller
# Created on: 13.12.20

library(bnlearn)
library(jsonlite)
library(xml2)


# Funktion zur Konvertierung von bnlearn BN zu XDSL
bn_to_xdsl <- function(bn_fitted, filename) {
  
  # Grundstruktur des XDSL Dokuments erstellen
  doc <- xml_new_root("smile", version = "1.0", id = "Network1", numsamples = "10000")
  
  # Nodes Section
  nodes <- xml_add_child(doc, "nodes")
  
  # Für jeden Knoten im Netzwerk
  node_names <- names(bn_fitted)
  
  for (node_name in node_names) {
    # CPT Node hinzufügen
    cpt_node <- xml_add_child(nodes, "cpt", id = node_name)
    
    parents <- bn_fitted[[node_name]]$parents

    # States (Zustände) des Knotens
    node_states <- dimnames(bn_fitted[[node_name]]$prob)[[length(dimnames(bn_fitted[[node_name]]$prob))]]
    
    if(length(parents)>0) {
      node_states <- dimnames(bn_fitted[[node_name]]$prob)[[1]]
    }

    for (state in node_states) {
      state_str <- paste0("state__", gsub("[^A-Za-z0-9_]", "_", state))
      xml_add_child(cpt_node, "state", id = state_str)
    }
    
    # Parents hinzufügen
    parents <- bn_fitted[[node_name]]$parents
    if (length(parents) > 0) {
      parents_text <- paste(parents, collapse = " ")
      xml_add_child(cpt_node, "parents", parents_text)
    }
    
    # Wahrscheinlichkeitstabelle extrahieren und formatieren
    prob_table <- as.numeric(bn_fitted[[node_name]]$prob)
    prob_text <- paste(prob_table, collapse = " ")
    xml_add_child(cpt_node, "probabilities", prob_text)
  }
  
  # Extensions Section (optional, für GeNIe compatibility)
  extensions <- xml_add_child(doc, "extensions")
  genie <- xml_add_child(extensions, "genie", version = "1.0", app = "GeNIe 2.0", 
                         name = "Network1", faultnameformat = "nodestate")
  
  # Node-Positionen (Standardwerte)
  for (i in seq_along(node_names)) {
    node_ext <- xml_add_child(genie, "node", id = node_names[i])
    xml_add_child(node_ext, "name", node_names[i])
    xml_add_child(node_ext, "interior", color = "e5f6f7")
    xml_add_child(node_ext, "outline", color = "000080")
    xml_add_child(node_ext, "font", color = "000000", name = "Arial", size = "8")
    # Einfache Positionierung in einem Grid
    x_pos <- (i %% 5) * 150 + 100
    y_pos <- ((i - 1) %/% 5) * 100 + 100
    xml_add_child(node_ext, "position", paste(x_pos, y_pos, x_pos + 80, y_pos + 40))
    xml_add_child(node_ext, "barchart", active = "true", width = "128", height = "64")
  }
  
  # XML in Datei schreiben
  write_xml(doc, filename, options = "format")  
}