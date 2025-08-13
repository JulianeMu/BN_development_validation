import xml.etree.ElementTree as ET
from collections import deque, defaultdict
import pysmile
import copy

class XDSLNodeSorter:
    """
    Sortiert Knoten in XDSL-Dateien in topologischer Reihenfolge
    damit Eltern-Knoten vor Kindern geladen werden
    """
    
    def __init__(self):
        self.nodes = {}
        self.parent_child_map = defaultdict(list)
        self.child_parent_map = defaultdict(list)
    
    def parse_xdsl_structure(self, xdsl_file):
        """
        Parst XDSL-Datei und extrahiert Knoten-Hierarchie
        
        Args:
            xdsl_file: Pfad zur XDSL-Datei
            
        Returns:
            dict: Knoten-Informationen mit Parent-Child Beziehungen
        """
        
        print(f"=== Parsiere XDSL-Datei: {xdsl_file} ===")
        
        try:
            tree = ET.parse(xdsl_file)
            root = tree.getroot()
            
            # Alle CPT-Knoten finden
            cpt_nodes = root.findall(".//cpt")
            
            print(f"Gefundene CPT-Knoten: {len(cpt_nodes)}")
            
            for cpt_node in cpt_nodes:
                node_id = cpt_node.get('id')
                
                if not node_id:
                    print("⚠ Knoten ohne ID gefunden, überspringe...")
                    continue
                
                # Knoten-Element speichern
                self.nodes[node_id] = cpt_node
                
                # Eltern-Knoten extrahieren
                parents_element = cpt_node.find('parents')
                if parents_element is not None and parents_element.text:
                    # Parents sind durch Leerzeichen getrennt
                    parents = parents_element.text.strip().split()
                    
                    for parent in parents:
                        if parent:  # Leere Strings ignorieren
                            self.parent_child_map[parent].append(node_id)
                            self.child_parent_map[node_id].append(parent)
                            print(f"  Beziehung: {parent} -> {node_id}")
                else:
                    print(f"  Knoten {node_id} hat keine Eltern")
            
            print(f"\n✓ Parsing abgeschlossen: {len(self.nodes)} Knoten gefunden")
            return self.nodes
            
        except ET.ParseError as e:
            print(f"✗ XML Parse Fehler: {e}")
            return {}
        except Exception as e:
            print(f"✗ Allgemeiner Fehler beim Parsing: {e}")
            return {}
    
    def topological_sort(self):
        """
        Führt topologische Sortierung durch
        
        Returns:
            list: Knoten-IDs in topologisch sortierter Reihenfolge
        """
        
        print("\n=== Topologische Sortierung ===")
        
        # Kahn's Algorithmus für topologische Sortierung
        
        # 1. In-Degree für jeden Knoten berechnen
        in_degree = defaultdict(int)
        all_nodes = set(self.nodes.keys())
        
        # Alle referenzierten Parent-Knoten hinzufügen (falls sie fehlen)
        for parents in self.child_parent_map.values():
            for parent in parents:
                all_nodes.add(parent)
        
        # In-Degree initialisieren
        for node in all_nodes:
            in_degree[node] = len(self.child_parent_map[node])
        
        print("In-Degree Berechnung:")
        for node, degree in sorted(in_degree.items()):
            print(f"  {node}: {degree}")
        
        # 2. Queue mit Knoten ohne Eltern (in-degree = 0)
        queue = deque()
        for node in all_nodes:
            if in_degree[node] == 0:
                queue.append(node)
                print(f"  Startknoten (keine Eltern): {node}")
        
        sorted_nodes = []
        
        # 3. Topologische Sortierung
        while queue:
            current = queue.popleft()
            sorted_nodes.append(current)
            
            # Alle Kinder des aktuellen Knotens
            for child in self.parent_child_map[current]:
                in_degree[child] -= 1
                if in_degree[child] == 0:
                    queue.append(child)
        
        # 4. Zyklenprüfung
        if len(sorted_nodes) != len(all_nodes):
            remaining_nodes = all_nodes - set(sorted_nodes)
            print(f"⚠ WARNUNG: Zyklische Abhängigkeiten erkannt!")
            print(f"  Nicht sortierbare Knoten: {remaining_nodes}")
            
            # Füge verbleibende Knoten am Ende hinzu
            sorted_nodes.extend(remaining_nodes)
        
        print(f"\n✓ Sortierung abgeschlossen: {len(sorted_nodes)} Knoten")
        print("Sortierte Reihenfolge:", " -> ".join(sorted_nodes))
        
        return sorted_nodes
    
    def create_sorted_xdsl(self, original_file, output_file, sorted_nodes):
        """
        Erstellt neue XDSL-Datei mit sortierten Knoten
        
        Args:
            original_file: Original XDSL-Datei
            output_file: Ausgabe-Datei
            sorted_nodes: Sortierte Knoten-Liste
        """
        
        print(f"\n=== Erstelle sortierte XDSL: {output_file} ===")
        
        try:
            # Original XML parsen
            tree = ET.parse(original_file)
            root = tree.getroot()
            
            # Nodes Section finden
            nodes_section = root.find('nodes')
            if nodes_section is None:
                print("✗ Keine 'nodes' Sektion gefunden")
                return False
            
            # Alle CPT-Knoten entfernen
            for cpt in nodes_section.findall('cpt'):
                nodes_section.remove(cpt)
            
            # Knoten in sortierter Reihenfolge hinzufügen
            for node_id in sorted_nodes:
                if node_id in self.nodes:
                    # Original Knoten kopieren und hinzufügen
                    node_copy = copy.deepcopy(self.nodes[node_id])
                    nodes_section.append(node_copy)
                    print(f"  ✓ Knoten {node_id} hinzugefügt")
                else:
                    print(f"  ⚠ Knoten {node_id} nicht in Original gefunden")
            
            # Sortierte XML speichern
            tree.write(output_file, encoding='utf-8', xml_declaration=True)
            print(f"✓ Sortierte XDSL-Datei gespeichert: {output_file}")
            
            return True
            
        except Exception as e:
            print(f"✗ Fehler beim Erstellen der sortierten Datei: {e}")
            return False
    
    def verify_with_pysmile(self, xdsl_file):
        """
        Verifiziert die sortierte XDSL-Datei mit PySmile
        
        Args:
            xdsl_file: XDSL-Datei zum Testen
            
        Returns:
            bool: True wenn erfolgreich geladen
        """
        
        print(f"\n=== PySmile Verifikation: {xdsl_file} ===")
        
        try:
            net = pysmile.Network()
            net.read_file(xdsl_file)
            
            all_nodes = net.get_all_nodes()
            print(f"✓ Netzwerk erfolgreich geladen: {len(all_nodes)} Knoten")
            
            # Knoten-Details anzeigen
            for node_handle in all_nodes:
                node_id = net.get_node_id(node_handle)
                parents = net.get_parents(node_handle)
                parent_ids = [net.get_node_id(p) for p in parents]
                print(f"  Knoten: {node_id}, Eltern: {parent_ids}")
            
            return True
            
        except pysmile.SMILEException as e:
            print(f"✗ PySmile Fehler: {e}")
            return False
        except Exception as e:
            print(f"✗ Allgemeiner Fehler: {e}")
            return False
    
    def analyze_loading_order(self, sorted_nodes):
        """
        Analysiert die Lade-Reihenfolge und zeigt Statistiken
        """
        
        print(f"\n=== Lade-Reihenfolge Analyse ===")
        
        position_map = {node: i for i, node in enumerate(sorted_nodes)}
        
        valid_order = True
        issues = []
        
        for child, parents in self.child_parent_map.items():
            if child in position_map:
                child_pos = position_map[child]
                
                for parent in parents:
                    if parent in position_map:
                        parent_pos = position_map[parent]
                        
                        if parent_pos >= child_pos:
                            valid_order = False
                            issue = f"Problem: {parent} (pos {parent_pos}) sollte vor {child} (pos {child_pos}) laden"
                            issues.append(issue)
                            print(f"  ✗ {issue}")
                        else:
                            print(f"  ✓ {parent} (pos {parent_pos}) vor {child} (pos {child_pos})")
        
        if valid_order:
            print("✓ Alle Eltern werden vor ihren Kindern geladen!")
        else:
            print(f"✗ {len(issues)} Reihenfolge-Probleme gefunden")
        
        return valid_order, issues

def sort_xdsl_nodes(input_file, output_file=None):
    """
    Hauptfunktion zum Sortieren von XDSL-Knoten
    
    Args:
        input_file: Input XDSL-Datei
        output_file: Output XDSL-Datei (optional)
        
    Returns:
        bool: True wenn erfolgreich
    """
    
    if output_file is None:
        output_file = input_file.replace('.xdsl', '_sorted.xdsl')
    
    print("="*60)
    print("XDSL NODE SORTER - Topologische Sortierung")
    print("="*60)
    
    sorter = XDSLNodeSorter()
    
    # 1. XDSL-Struktur parsen
    nodes = sorter.parse_xdsl_structure(input_file)
    if not nodes:
        print("✗ Parsing fehlgeschlagen")
        return False
    
    # 2. Topologische Sortierung
    sorted_nodes = sorter.topological_sort()
    if not sorted_nodes:
        print("✗ Sortierung fehlgeschlagen")
        return False
    
    # 3. Lade-Reihenfolge analysieren
    valid_order, issues = sorter.analyze_loading_order(sorted_nodes)
    
    # 4. Sortierte XDSL erstellen
    success = sorter.create_sorted_xdsl(input_file, output_file, sorted_nodes)
    if not success:
        print("✗ Erstellung der sortierten Datei fehlgeschlagen")
        return False
    
    # 5. Mit PySmile verifizieren
    verification_success = sorter.verify_with_pysmile(output_file)
    
    print("\n" + "="*60)
    print("ZUSAMMENFASSUNG:")
    print(f"Input:  {input_file}")
    print(f"Output: {output_file}")
    print(f"Knoten: {len(nodes)}")
    print(f"Sortierung: {'✓ Erfolgreich' if valid_order else '✗ Mit Problemen'}")
    print(f"PySmile: {'✓ Verifiziert' if verification_success else '✗ Fehler'}")
    print("="*60)
    
    return success and verification_success

# Beispiel-Verwendung und Test-Funktionen
def example_usage():
    """
    Beispiel für die Verwendung des Node Sorters
    """
    
    # Beispiel 1: Einzelne Datei sortieren
    input_file = "mein_netzwerk.xdsl"
    output_file = "mein_netzwerk_sorted.xdsl"
    
    if sort_xdsl_nodes(input_file, output_file):
        print("✅ Erfolgreich sortiert!")
        
        # Sortierte Datei mit PySmile laden
        net = pysmile.Network()
        net.read_file(output_file)
        print(f"Netzwerk mit {len(net.get_all_nodes())} Knoten geladen")
    else:
        print("❌ Sortierung fehlgeschlagen")

def batch_sort_xdsl_files(file_list):
    """
    Mehrere XDSL-Dateien sortieren
    
    Args:
        file_list: Liste von XDSL-Dateipfaden
    """
    
    print(f"\n=== BATCH SORTIERUNG: {len(file_list)} Dateien ===")
    
    results = []
    for input_file in file_list:
        output_file = input_file.replace('.xdsl', '_sorted.xdsl')
        success = sort_xdsl_nodes(input_file, output_file)
        results.append((input_file, success))
        print(f"{'✓' if success else '✗'} {input_file}")
    
    successful = sum(1 for _, success in results if success)
    print(f"\nBatch-Ergebnis: {successful}/{len(file_list)} erfolgreich")
    
    return results

if __name__ == "__main__":
    # Uncomment zum Testen:
    # example_usage()
    
    # Oder für Batch-Verarbeitung:
    # files = ["network1.xdsl", "network2.xdsl", "network3.xdsl"]
    # batch_sort_xdsl_files(files)
    
    print("🔧 XDSL Node Sorter bereit!")
    print("Verwendung: sort_xdsl_nodes('input.xdsl', 'output.xdsl')")