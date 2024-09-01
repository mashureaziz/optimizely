#!/bin/bash

# Define the .gitignore file path
GITIGNORE_FILE=".gitignore"

# Create or overwrite the .gitignore file
cat <<EOL > $GITIGNORE_FILE
# Node modules
node_modules/

# Logs
*.log

# OS generated files
.DS_Store
Thumbs.db

# Environment variables
.env

# Build directories
dist/
build/

# Dependency directories
bower_components/

# Coverage directory used by tools like istanbul
coverage/

# Temporary files
*.tmp
*.temp

# IDE specific files
.vscode/
.idea/
*.sublime-project
*.sublime-workspace

# NPM package lock file
package-lock.json
yarn.lock
EOL

echo ".gitignore file created with common ignore patterns."
