#!/bin/bash

INPUT="$1"
OUTPUT="$2"

if [ -z "$INPUT" ] || [ -z "$OUTPUT" ]; then
  echo "Usage: compress-jpg.sh input.jpg output.jpg"
  exit 1
fi

# Copy original to output
# Copy original to output only if they are different
if [ "$INPUT" != "$OUTPUT" ]; then
  cp "$INPUT" "$OUTPUT"
fi
chmod 666 "$OUTPUT"

# Optimize JPEG in-place
jpegoptim \
  --max=75 \
  --strip-all \
  --all-progressive \
  "$OUTPUT"
