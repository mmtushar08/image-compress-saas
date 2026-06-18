# ─────────────────────────────────────────────────────────────────────────────
# Stage 1 — Build the React client into static assets
# ─────────────────────────────────────────────────────────────────────────────
FROM node:22-bookworm-slim AS client-build
WORKDIR /app/client

COPY client/package*.json ./
RUN npm ci

COPY client/ ./
RUN npm run build

# ─────────────────────────────────────────────────────────────────────────────
# Stage 2 — Install API production deps (compiles native modules here)
# ─────────────────────────────────────────────────────────────────────────────
FROM node:22-bookworm-slim AS api-deps
WORKDIR /app/api

# Build toolchain for native modules (better-sqlite3, sharp fallbacks)
RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

COPY api/package*.json ./
RUN npm ci --omit=dev

# ─────────────────────────────────────────────────────────────────────────────
# Stage 3 — Runtime image
# ─────────────────────────────────────────────────────────────────────────────
FROM node:22-bookworm-slim AS runtime

# dumb-init for correct PID 1 signal handling (graceful shutdown)
RUN apt-get update \
    && apt-get install -y --no-install-recommends dumb-init \
    && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV PORT=5000

WORKDIR /app/api

# Production node_modules from the deps stage
COPY --from=api-deps /app/api/node_modules ./node_modules

# API source
COPY api/ ./

# Built client assets (server.js serves ../../client/dist)
COPY --from=client-build /app/client/dist /app/client/dist

# Runtime working directories (volumes mount over these in compose)
RUN mkdir -p src/data src/logs uploads output \
    && chown -R node:node /app

USER node
EXPOSE 5000

# Healthcheck hits the same endpoint compose/k8s would probe
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD node -e "require('http').get('http://localhost:5000/api/health',r=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "src/server.js"]
