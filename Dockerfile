# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Runtime
FROM node:20-alpine AS runtime
WORKDIR /app

# Copy Nuxt server output
COPY --from=build /app/.output ./.output

# Copy Prisma schema and migration files (needed for migrate deploy)
COPY --from=build /app/prisma ./prisma

# Copy all of node_modules so the Prisma CLI has every file it needs at runtime
# (WASM binaries, engine binaries, etc.) without having to cherry-pick paths
# that can change between Prisma versions.
COPY --from=build /app/node_modules ./node_modules

# Nitro bundles the Prisma client JS into .output but skips the native query
# engine binary. Overwrite with the fully generated client from the build stage.
COPY --from=build /app/node_modules/.prisma/client ./.output/server/node_modules/.prisma/client

COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

ENV NODE_ENV=production
EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
