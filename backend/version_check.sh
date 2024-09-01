#!/bin/bash

# Check for outdated packages and print the latest versions
echo "Checking for outdated packages..."

# Run npm outdated and format the output
npm outdated --json | jq -r 'to_entries | .[] | "\(.key): \(.value.latest)"'
