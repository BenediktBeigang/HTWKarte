import os
import xml.etree.ElementTree as ET
import time

def extract_room_ids_from_svg(file_path):
    # Define the SVG namespace
    namespace = {'svg': 'http://www.w3.org/2000/svg'}
    ET.register_namespace('', 'http://www.w3.org/2000/svg')
    
    # Parse the SVG file
    tree = ET.parse(file_path)
    root = tree.getroot()
    
    # List to store extracted IDs
    room_ids = []
    
    # Iterate through 'floor_?' groups and their 'rooms_?' children
    for floor_group in root.findall(".//svg:g", namespace):
        if 'id' in floor_group.attrib and floor_group.attrib['id'].startswith('floor_'):
            for rooms_group in floor_group.findall(".//svg:g", namespace):
                if 'id' in rooms_group.attrib and rooms_group.attrib['id'].startswith('rooms_'):
                    for child in rooms_group:
                        if 'id' in child.attrib:
                            room_ids.append(child.attrib['id'])
    
    return room_ids

def extract_ids_from_all_svgs_in_directory(directory_path):
    all_ids = []
    
    for root, dirs, files in os.walk(directory_path):
        for file in files:
            if file.endswith('.svg'):
                file_path = os.path.join(root, file)
                ids = extract_room_ids_from_svg(file_path)
                all_ids.extend(ids)

    return [id for id in all_ids if 'rect' not in id and 'path' not in id and 'lift' not in id]
            
def levenshtein_distance(a: str, b: str) -> int:
    # Initialisiere die Matrix.
    matrix = [[0] * (len(b) + 1) for _ in range(len(a) + 1)]

    # Fülle die erste Zeile und die erste Spalte.
    for i in range(len(a) + 1):
        matrix[i][0] = i
    for j in range(len(b) + 1):
        matrix[0][j] = j

    # Berechne die Levenshtein-Distanz.
    for i in range(1, len(a) + 1):
        for j in range(1, len(b) + 1):
            cost = 0 if a[i - 1] == b[j - 1] else 1

            matrix[i][j] = min(
                matrix[i - 1][j] + 1,    # Löschung
                matrix[i][j - 1] + 1,    # Einfügen
                matrix[i - 1][j - 1] + cost  # Ersetzen
            )

    return matrix[len(a)][len(b)]

def testLevenshteinDistance():
    directory_path = '../public/Buildings/'
    all_ids = extract_ids_from_all_svgs_in_directory(directory_path)
    testString = "ZU420"
    best_matches = []

    start_time = time.time()
    for id in all_ids:
        dis = levenshtein_distance(testString, id)
        if len(best_matches) < 10:
            best_matches.append((id, dis))
            best_matches.sort(key=lambda x: x[1])
        elif dis < best_matches[-1][1]:
            best_matches[-1] = (id, dis)
            best_matches.sort(key=lambda x: x[1])
    end_time = time.time()

    execution_time = end_time - start_time
    print(f"Execution time: {execution_time:.4f} seconds")
    print("Best 10 matches:")
    for match in best_matches:
        print(f"ID: {match[0]}, Distance: {match[1]}")

    # Assertions (example, adjust as needed)
    assert len(best_matches) == 10
    assert all(isinstance(match, tuple) and len(match) == 2 for match in best_matches)
    assert all(isinstance(match[1], int) for match in best_matches)

testLevenshteinDistance()

# # Beispielaufruf der Funktion
# directory_path = '../public/Buildings/'
# output_file = './roomIds.txt'
# all_ids = extract_ids_from_all_svgs_in_directory(directory_path, output_file)
# with open(output_file, 'w') as f:
#         for id in all_ids:
#             f.write(f"{id}\n")