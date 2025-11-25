#!/bin/bash

# Name of the output zip file
OUTPUT_FILE="flipflix.zip"

# Remove existing zip file if it exists
if [ -f "$OUTPUT_FILE" ]; then
    rm "$OUTPUT_FILE"
fi

# Create the zip file
zip -r "$OUTPUT_FILE" \
    manifest.json \
    content.js \
    styles.css \
    popup.html \
    popup.js \
    icon16.png \
    icon48.png \
    icon128.png

echo "Created $OUTPUT_FILE"
