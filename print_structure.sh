#!/bin/bash

# Output file
output_file="project_structure.txt"

# Clear the output file
> "$output_file"

# Function to print the contents of files
print_contents() {
    local dir="$1"
    for file in "$dir"/*; do
        if [ -d "$file" ]; then
            echo "$file/" >> "$output_file"  # Print directory name
            print_contents "$file"            # Recursively print contents
        else
            echo "$file" >> "$output_file"    # Print file name
            echo "Contents of $file:" >> "$output_file"
            cat "$file" >> "$output_file"     # Print file contents
            echo "" >> "$output_file"          # Add a newline for separation
        fi
    done
}

# Start from the current directory
print_contents "."

echo "Project structure and contents written to $output_file"
