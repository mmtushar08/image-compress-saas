FROM ubuntu:22.04

RUN apt-get update && apt-get install -y \
    pngquant \
    zopfli \
    jpegoptim \
    webp \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . /app

RUN chmod +x compress.sh compress-png.sh compress-jpg.sh

ENTRYPOINT ["/bin/bash"]
