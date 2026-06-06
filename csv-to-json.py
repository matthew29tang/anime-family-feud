import csv
import json

def csv_to_compact_json(csv_file_path, json_file_path):
    with open(csv_file_path, mode='r', encoding='utf-8') as csv_file:
        csv_reader = csv.reader(csv_file)
        array_of_arrays = list(csv_reader)
        
    with open(json_file_path, mode='w', encoding='utf-8') as json_file:
        json_file.write("[\n")
        
        # Loop through all rows except the last one
        for i in range(len(array_of_arrays)):
            row = array_of_arrays[i]
            # json.dumps converts the single list into a compact string line
            row_json = json.dumps(row)
            
            # If it's not the last element, add a comma
            if i < len(array_of_arrays) - 1:
                json_file.write(f"  {row_json},\n")
            else:
                json_file.write(f"  {row_json}\n")
                
        json_file.write("]")

# Example usage:
csv_to_compact_json('tearjerkers.csv', 'data.json')