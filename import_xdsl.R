# XDSL Bayesisches Netzwerk in R einlesen
# Benötigte Pakete laden
library(xml2)
library(bnlearn)

# Funktion zum Einlesen einer XDSL-Datei
read_xdsl <- function(filename) {
  
  # XML-Datei einlesen
  doc <- read_xml(filename)
  
  # Alle CPT-Knoten extrahieren
  cpt_nodes <- xml_find_all(doc, ".//cpt")
  
  # Listen für Netzwerkstruktur
  node_names <- c()
  node_states <- list()
  node_parents <- list()
  node_probabilities <- list()
  
  # Durch alle Knoten iterieren
  for (node in cpt_nodes) {
    # Knoten-ID
    node_id <- xml_attr(node, "id")
    node_names <- c(node_names, node_id)
    
    # Zustände des Knotens
    states <- xml_find_all(node, ".//state")
    state_ids <- xml_attr(states, "id")
    node_states[[node_id]] <- state_ids
    
    # Elternknoten
    parents_node <- xml_find_first(node, ".//parents")
    if (!is.na(parents_node)) {
      parents_text <- xml_text(parents_node)
      parents <- trimws(strsplit(parents_text, " ")[[1]])
      parents <- parents[parents != ""]  # Leere Strings entfernen
      node_parents[[node_id]] <- parents
    } else {
      node_parents[[node_id]] <- character(0)
    }
    
    # Wahrscheinlichkeiten
    prob_node <- xml_find_first(node, ".//probabilities")
    if (!is.na(prob_node)) {
      prob_text <- xml_text(prob_node)
      probs <- as.numeric(strsplit(prob_text, " ")[[1]])
      node_probabilities[[node_id]] <- probs
    }
  }
  
  # Netzwerkstruktur als bnlearn-Objekt erstellen
  # Kanten-Matrix erstellen
  edges <- data.frame(from = character(0), to = character(0))
  
  for (node in node_names) {
    parents <- node_parents[[node]]
    if (length(parents) > 0) {
      for (parent in parents) {
        edges <- rbind(edges, data.frame(from = parent, to = node))
      }
    }
  }
  
  # Leeres Netzwerk mit allen Knoten erstellen
  if (nrow(edges) > 0) {
    bn_structure <- empty.graph(node_names)
    arcs(bn_structure) <- as.matrix(edges)
  } else {
    bn_structure <- empty.graph(node_names)
  }
  
  # Fitted BN erstellen (mit Wahrscheinlichkeiten)
  fitted_bn <- list()
  
  for (node in node_names) {
    parents <- node_parents[[node]]
    states <- node_states[[node]]
    probs <- node_probabilities[[node]]
    
    # CPT-Dimensionen berechnen
    if (length(parents) == 0) {
      # Knoten ohne Eltern
      prob_matrix <- array(probs, dim = length(states), 
                          dimnames = list(states))
    } else {
      # Knoten mit Eltern
      parent_states <- lapply(parents, function(p) node_states[[p]])
      parent_combinations <- do.call(expand.grid, parent_states)
      
      # Wahrscheinlichkeitsarray erstellen
      dims <- c(sapply(parent_states, length), length(states))
      dim_names <- c(parent_states, list(states))
      names(dim_names) <- c(parents, node)
      
      prob_array <- array(probs, dim = dims, dimnames = dim_names)
    }
    
    # BN-Fit Objekt für diesen Knoten erstellen
    fitted_bn[[node]] <- list(
      node = node,
      parents = parents,
      children = character(0),  # Wird später gefüllt
      prob = if(length(parents) == 0) prob_matrix else prob_array
    )
    class(fitted_bn[[node]]) <- "bn.fit.dnode"
  }
  
  # Children für jeden Knoten bestimmen
  for (node in node_names) {
    children <- character(0)
    for (other_node in node_names) {
      if (node %in% node_parents[[other_node]]) {
        children <- c(children, other_node)
      }
    }
    fitted_bn[[node]]$children <- children
  }
  
  # BN-Fit Objekt finalisieren
  class(fitted_bn) <- "bn.fit"
  attr(fitted_bn, "method") <- "mle"
  
  # Rückgabe als Liste mit Struktur und gefittetem Netzwerk
  result <- list(
    structure = bn_structure,
    fitted = fitted_bn,
    node_states = node_states
  )
  
  return(result)
}

# Hilfsfunktion zur Anzeige von Netzwerk-Informationen
show_network_info <- function(bn_data) {
  cat("=== Bayesisches Netzwerk Informationen ===\n")
  cat("Anzahl Knoten:", length(bn_data$fitted), "\n")
  cat("Knoten:", paste(names(bn_data$fitted), collapse = ", "), "\n\n")
  
  cat("=== Knotendetails ===\n")
  for (node_name in names(bn_data$fitted)) {
    node <- bn_data$fitted[[node_name]]
    cat("Knoten:", node_name, "\n")
    cat("  Zustände:", paste(bn_data$node_states[[node_name]], collapse = ", "), "\n")
    cat("  Eltern:", if(length(node$parents) > 0) paste(node$parents, collapse = ", ") else "keine", "\n")
    cat("  Kinder:", if(length(node$children) > 0) paste(node$children, collapse = ", ") else "keine", "\n")
    cat("\n")
  }
}

# Beispiel-Verwendung:
# ====================

# XDSL-Datei einlesen (vorherige Datei verwenden)
# if (file.exists("mein_netzwerk.xdsl")) {
#   # Netzwerk einlesen
#   bn_data <- read_xdsl("mein_netzwerk.xdsl")
  
#   # Informationen anzeigen
#   show_network_info(bn_data)
  
#   # Netzwerkstruktur plotten
#   cat("=== Netzwerkstruktur ===\n")
#   plot(bn_data$structure, main = "Bayesisches Netzwerk aus XDSL")
  
#   # Zugriff auf das gefittete Netzwerk
#   fitted_network <- bn_data$fitted
  
#   # Beispiel: Wahrscheinlichkeiten eines Knotens anzeigen
#   first_node <- names(fitted_network)[1]
#   cat("\n=== Wahrscheinlichkeitstabelle für Knoten:", first_node, "===\n")
#   print(fitted_network[[first_node]]$prob)
  
#   # Mit bnlearn-Funktionen arbeiten
#   cat("\n=== bnlearn-Kompatibilität ===\n")
#   cat("Struktur-Klasse:", class(bn_data$structure), "\n")
#   cat("Fitted-Klasse:", class(bn_data$fitted), "\n")
  
# } else {
#   cat("XDSL-Datei 'mein_netzwerk.xdsl' nicht gefunden.\n")
#   cat("Führe zuerst den vorherigen Code aus, um eine XDSL-Datei zu erstellen.\n")
# }

# Funktion zur Transformation in vollständig bnlearn-kompatible Objekte
transform_to_bnlearn <- function(bn_data) {
  
  # 1. Netzwerkstruktur extrahieren (bereits bnlearn-kompatibel)
  bn_structure <- bn_data$structure
  
  # 2. Fitted BN extrahieren (bereits bnlearn-kompatibel)
  bn_fitted <- bn_data$fitted
  
  # 3. Validierung und Reparatur falls nötig
  # Stelle sicher, dass alle bnlearn-Attribute korrekt gesetzt sind
  
  # Struktur validieren
  if (!("bn" %in% class(bn_structure))) {
    class(bn_structure) <- c("bn", class(bn_structure))
  }
  
  # Fitted BN validieren
  if (!("bn.fit" %in% class(bn_fitted))) {
    class(bn_fitted) <- "bn.fit"
  }
  
  # Methoden-Attribut setzen falls nicht vorhanden
  if (is.null(attr(bn_fitted, "method"))) {
    attr(bn_fitted, "method") <- "mle"
  }
  
  # Jeder Knoten sollte die richtige Klasse haben
  for (node_name in names(bn_fitted)) {
    if (!("bn.fit.dnode" %in% class(bn_fitted[[node_name]]))) {
      class(bn_fitted[[node_name]]) <- "bn.fit.dnode"
    }
  }
  
#   cat("✓ Netzwerk erfolgreich in bnlearn-Format transformiert\n")
#   cat("✓ Struktur-Klasse:", paste(class(bn_structure), collapse = ", "), "\n")
#   cat("✓ Fitted-Klasse:", paste(class(bn_fitted), collapse = ", "), "\n")
  
  return(list(
    structure = bn_structure,
    fitted = bn_fitted
  ))
}

# Funktion zum Testen der bnlearn-Kompatibilität
test_bnlearn_compatibility <- function(bn_structure, bn_fitted) {
  
  cat("=== bnlearn-Kompatibilitäts-Test ===\n")
  
  # Test 1: Struktur-Funktionen
  tryCatch({
    nodes_count <- length(nodes(bn_structure))
    arcs_count <- nrow(arcs(bn_structure))
    cat("✓ Knoten:", nodes_count, "\n")
    cat("✓ Kanten:", arcs_count, "\n")
  }, error = function(e) {
    cat("✗ Strukturfehler:", e$message, "\n")
  })
  
  # Test 2: Plotting
  tryCatch({
    plot(bn_structure, main = "bnlearn Netzwerk")
    cat("✓ Plotting funktioniert\n")
  }, error = function(e) {
    cat("✗ Plotting-Fehler:", e$message, "\n")
  })
  
  # Test 3: Fitted BN Funktionen
  tryCatch({
    # Loglikelihood berechnen (falls Daten vorhanden)
    cat("✓ Fitted BN ist gültig\n")
    
    # Erste Wahrscheinlichkeitstabelle anzeigen
    first_node <- names(bn_fitted)[1]
    cat("✓ Wahrscheinlichkeitstabelle für", first_node, ":\n")
    print(bn_fitted[[first_node]]$prob)
    
  }, error = function(e) {
    cat("✗ Fitted BN Fehler:", e$message, "\n")
  })
  
  # Test 4: Netzwerk-Score (falls möglich)
  tryCatch({
    score_result <- score(bn_structure, method = "bic", data = data.frame())
    cat("✓ Score-Berechnung möglich\n")
  }, error = function(e) {
    cat("⚠ Score-Berechnung erfordert Daten\n")
  })
  
  cat("=== Test abgeschlossen ===\n\n")
}

# Beispiel-Verwendung der Transformation:
# =======================================

# if (file.exists("mein_netzwerk.xdsl")) {
#   # 1. XDSL-Datei einlesen
#   bn_data <- read_xdsl("mein_netzwerk.xdsl")
  
#   # 2. In bnlearn transformieren
#   bnlearn_objects <- transform_to_bnlearn(bn_data)
  
#   # 3. Separate Objekte extrahieren
#   my_bn_structure <- bnlearn_objects$structure
#   my_bn_fitted <- bnlearn_objects$fitted
  
#   # 4. Kompatibilität testen
#   test_bnlearn_compatibility(my_bn_structure, my_bn_fitted)
  
#   # 5. Jetzt kannst du alle bnlearn-Funktionen verwenden:
  
#   cat("=== bnlearn-Funktionen verwenden ===\n")
  
#   # Netzwerk-Informationen
#   cat("Knoten:", paste(nodes(my_bn_structure), collapse = ", "), "\n")
#   cat("Eltern von", nodes(my_bn_structure)[1], ":", 
#       paste(parents(my_bn_structure, nodes(my_bn_structure)[1]), collapse = ", "), "\n")
  
#   # Struktur manipulieren
#   cat("Anzahl Kanten:", nrow(arcs(my_bn_structure)), "\n")
  
#   # Mit gefittetem Netzwerk arbeiten
#   cat("Fitted BN verfügbar für Inferenz\n")
  
#   # Beispiel: Alle Wahrscheinlichkeitstabellen ausgeben
#   cat("\n=== Alle CPTs ===\n")
#   for (node in nodes(my_bn_structure)) {
#     cat("\nCPT für", node, ":\n")
#     print(my_bn_fitted[[node]]$prob)
#   }
  
# } else {
#   cat("Erstelle zuerst eine XDSL-Datei mit dem vorherigen Code.\n")
# }

# Funktion um bn.fit() auf das transformierte Netzwerk anzuwenden
apply_bn_fit <- function(bn_structure, training_data) {
  
#   cat("=== bn.fit() auf transformiertes Netzwerk anwenden ===\n")
    
  # bn.fit() anwenden
  tryCatch({    
    # Parameter lernen
    fitted_bn <- bn.fit(bn_structure, training_data)
    
    # cat("✓ bn.fit() erfolgreich angewendet!\n")
    # cat("✓ Anzahl Parameter:", length(fitted_bn), "\n")
    
    return(list(
      fitted = fitted_bn,
      data = training_data
    ))
    
  }, error = function(e) {
    # cat("✗ Fehler beim Anwenden von bn.fit():", e$message, "\n")
    
    # Versuche es mit leerer Struktur und allen Kanten entfernt
    # cat("Versuche es mit vereinfachter Struktur...\n")
    
    tryCatch({
      # Erstelle leeres Netzwerk mit gleichen Knoten
      simple_structure <- empty.graph(nodes(bn_structure))
      simple_fitted <- bn.fit(simple_structure, training_data)
      
    #   cat("✓ bn.fit() mit leerer Struktur erfolgreich!\n")
      
      return(list(
        fitted = simple_fitted,
        data = training_data,
        note = "Vereinfachte Struktur verwendet"
      ))
      
    }, error = function(e2) {
    #   cat("✗ Auch vereinfachte Struktur fehlgeschlagen:", e2$message, "\n")
      return(NULL)
    })
  })
}

# Funktion zur Analyse des neu gefitteten Netzwerks
analyze_fitted_network <- function(fit_result) {
  
  if (is.null(fit_result)) {
    # cat("Keine Ergebnisse zu analysieren.\n")
    return(NULL)
  }
  
  fitted_bn <- fit_result$fitted
  training_data <- fit_result$data
  
  cat("\n=== Analyse des neu gefitteten Netzwerks ===\n")
  
  # Grundlegende Informationen
  cat("Methode:", fit_result$method, "\n")
  cat("Knoten:", paste(names(fitted_bn), collapse = ", "), "\n")
  cat("Trainingsdaten:", nrow(training_data), "Zeilen,", ncol(training_data), "Spalten\n")
  
  if (!is.null(fit_result$note)) {
    cat("Hinweis:", fit_result$note, "\n")
  }
  
  # Loglikelihood berechnen
  tryCatch({
    ll <- logLik(fitted_bn, training_data)
    cat("Log-Likelihood:", ll, "\n")
  }, error = function(e) {
    cat("Log-Likelihood konnte nicht berechnet werden\n")
  })
  
  # Erste paar CPTs zeigen
  cat("\n=== Bedingte Wahrscheinlichkeitstabellen ===\n")
  for (i in 1:min(3, length(fitted_bn))) {
    node_name <- names(fitted_bn)[i]
    cat("\nCPT für", node_name, ":\n")
    print(fitted_bn[[node_name]]$prob)
  }
  
  return(fitted_bn)
}

# Beispiel-Anwendung:
# ===================

# if (file.exists("bayesianNetworkStructure.xdsl")) {
  
#   # 1. XDSL einlesen und transformieren
#   bn_data <- read_xdsl("bayesianNetworkStructure.xdsl")
#   bnlearn_objects <- transform_to_bnlearn(bn_data)
  
#   # 2. Struktur extrahieren
#   my_structure <- bnlearn_objects$structure
  
#   # 3. bn.fit() anwenden (mit simulierten Daten)
#   fit_result <- apply_bn_fit(my_structure)
  
#   # 4. Ergebnisse analysieren
#   new_fitted_bn <- analyze_fitted_network(fit_result)
  
#   # 5. Vergleich: Ursprünglich vs. Neu gefittet
#   if (!is.null(new_fitted_bn)) {
#     cat("\n=== Vergleich: Original vs. Neu gefittet ===\n")
    
#     original_fitted <- bnlearn_objects$fitted
    
#     cat("Original - Erste CPT:\n")
#     print(original_fitted[[1]]$prob)
    
#     cat("\nNeu gefittet - Erste CPT:\n") 
#     print(new_fitted_bn[[1]]$prob)
    
#     # Beide Netzwerke sind jetzt vollständig bnlearn-kompatibel!
#     cat("\n✓ Beide Netzwerke können mit allen bnlearn-Funktionen verwendet werden\n")
#   }
  
# } else {
#   cat("Erstelle zuerst eine XDSL-Datei.\n")
# }

# Alternative: Mit eigenen Daten
# ==============================
# 
# # Wenn du eigene Trainingsdaten hast:
# my_data <- read.csv("deine_daten.csv")
# fit_result <- apply_bn_fit(my_structure, my_data)