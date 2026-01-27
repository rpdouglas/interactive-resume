#!/bin/bash

# ==========================================
# 🚀 FRESH NEST: UNIVERSAL CONTEXT GENERATOR
# ==========================================

OUTPUT_FILE="docs/FULL_CODEBASE_CONTEXT.md"

echo "🔄 Generating Universal Context Dump..."
echo "# FRESH NEST: CODEBASE DUMP" > "$OUTPUT_FILE"
echo "**Date:** $(date)" >> "$OUTPUT_FILE"
echo "**Description:** Complete codebase context." >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Define the ingest function
ingest_file() {
    local filepath="$1"
    
    # 1. Skip if file does not exist (safety check)
    if [ ! -f "$filepath" ]; then return; fi

    # 2. Skip the Output File itself (prevent recursion loop)
    if [[ "$filepath" == "$OUTPUT_FILE" ]]; then return; fi

    echo "Processing: $filepath"
    
    # Markdown Header for the file
    echo "## FILE: $filepath" >> "$OUTPUT_FILE"
    
    # Determine syntax highlighting based on extension
    local ext="${filepath##*.}"
    echo "\`\`\`$ext" >> "$OUTPUT_FILE"
    
    # Cat the content
    cat "$filepath" >> "$OUTPUT_FILE"
    
    echo "" >> "$OUTPUT_FILE"
    echo "\`\`\`" >> "$OUTPUT_FILE"
    echo "---" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
}

# ==========================================
# 🔍 THE UNIVERSAL SCANNER
# ==========================================
# Finds ALL files (.)
# -type f: Only files
# -not -path: Exclude .git folder
# -not -path: Exclude node_modules (root and sub-project)
# -not -path: Exclude .env files (Security)
# -not -path: Exclude .DS_Store (Mac junk)
# -not -path: Exclude dist/build folders
# -not -path: Exclude package-lock.json (Too noisy)
# sort: Alphabetical order for consistency

find . -type f \
    -not -path '*/.git/*' \
    -not -path '*/node_modules/*' \
    -not -path '*/dist/*' \
    -not -path '*/.firebase/*' \
    -not -name '.DS_Store' \
    -not -name 'package-lock.json' \
    -not -name '*.lock' \
    -not -name '.env*' \
    -not -name 'service-account*' \
    | sort | while read file; do
        # Strip leading ./ for cleaner headers
        clean_path="${file#./}"
        ingest_file "$clean_path"
    done

echo "✅ Context Generated at: $OUTPUT_FILE"