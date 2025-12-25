#!/bin/bash

INPUT="$1"
OUTPUT="$2"

if [ -z "$INPUT" ] || [ -z "$OUTPUT" ]; then
  echo "Usage: compress-png.sh input.png output.png"
  exit 1
fi

# Try pngquant. If it fails (e.g. quality not met), copy original.
if ! pngquant \
  --quality=65-85 \
  --speed=3 \
  --strip \
  --force \
  --output "$OUTPUT" \
  "$INPUT"; then
    echo "pngquant failed or quality not met, copying original."
    cp "$INPUT" "$OUTPUT"
fi
chmod 666 "$OUTPUT"
