#!/bin/bash

# List of packages to check
packages=(
    "body-parser"
    "cors"
    "express"
    "express-rate-limit"
    "express-validator"
    "helmet"
    "mongoose"
    "morgan"
    "uuid"
    "winston"
    "swagger-jsdoc"
    "swagger-ui-express"
)

echo "Checking for type definitions in packages..."

for package in "${packages[@]}"; do
    echo -n "$package: "
    if npm info "$package" | grep -q "types"; then
        echo "Includes type definitions"
    else
        echo "Does NOT include type definitions"
    fi
done
