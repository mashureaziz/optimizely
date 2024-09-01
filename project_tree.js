const fs = require('fs');
const path = require('path');

// Specify the folders to include
const includedFolders = ['routes', 'models', 'middlewares', 'controllers'];

function readDir(dir, depth = 0) {
    const files = fs.readdirSync(dir);
    let tree = '';

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);

        // Skip the node_modules directory, package-lock.json file, and error.log file
        if (file === 'node_modules' || file === 'package-lock.json' || file === 'error.log') {
            return;
        }

        // Indentation based on depth
        const indent = '  '.repeat(depth);

        if (stats.isDirectory()) {
            // Check if the directory is one of the included folders
            if (includedFolders.includes(file)) {
                tree += `${indent}${file}/\n`;
                tree += readDir(filePath, depth + 1); // Recursive call for subdirectories
            }
        } else {
            // Only include files if they are in the specified folders
            const parentDir = path.basename(path.dirname(filePath));
            if (includedFolders.includes(parentDir)) {
                // Read file contents
                const content = fs.readFileSync(filePath, 'utf-8');
                tree += `${indent}${file}:\n${indent}${content}\n\n`;
            }
        }
    });

    return tree;
}

// Change this to your project directory
const projectDir = './backend'; // Updated to point to the backend directory
const projectTree = readDir(projectDir);

// Output file path
const outputFilePath = 'project_output_backend.txt'; // Updated output file name
fs.writeFileSync(outputFilePath, projectTree);
console.log(`Project tree written to ${outputFilePath}`);
