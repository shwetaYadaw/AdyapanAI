FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable

# Install dependencies
FROM base AS deps
COPY package.json yarn.lock ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/shared/package.json ./packages/shared/
RUN yarn install --frozen-lockfile

# Build shared package
FROM deps AS build
COPY packages/shared ./packages/shared
COPY apps/backend ./apps/backend
RUN yarn workspace @adyapan/shared build
RUN yarn workspace @adyapan/backend build

# Production image
FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app

COPY --from=build /app/apps/backend/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/backend/package.json ./

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodeuser
USER nodeuser

EXPOSE 5000
CMD ["node", "dist/server.js"]
