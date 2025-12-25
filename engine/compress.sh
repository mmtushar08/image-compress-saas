#!/bin/bash

INPUT=$(echo "$1" | tr -d '\r')
OUTPUT=$(echo "$2" | tr -d '\r')
FORMAT=$(echo "$3" | tr -d '\r')

if [ -z "$INPUT" ] || [ -z "$OUTPUT" ]; then
  echo "Usage: compress.sh input output [format]"
  exit 1
fi

EXT="${INPUT##*.}"
EXT=$(echo "$EXT" | tr '[:upper:]' '[:lower:]')

# If format override is provided
if [ -n "$FORMAT" ]; then
    EXT="$FORMAT"
fi

if [[ "$EXT" == "jpg" || "$EXT" == "jpeg" ]]; then
    bash ./engine/compress-jpg.sh "$INPUT" "$OUTPUT"
elif [[ "$EXT" == "png" ]]; then
    bash ./engine/compress-png.sh "$INPUT" "$OUTPUT"
elif [[ "$EXT" == "webp" ]]; then
    # Re-compress WebP
    # cwebp input.webp -o output.webp -q 75
    cwebp -q 75 "$INPUT" -o "$OUTPUT"
else
    echo "Unsupported format: $EXT"
    exit 1
fi
