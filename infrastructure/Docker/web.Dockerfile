# # syntax=docker/dockerfile:1
# ARG NX_APP_NAME=web

# FROM node:22-alpine AS builder
# ARG NX_APP_NAME
# WORKDIR /workspace

# RUN corepack enable && corepack prepare pnpm@11.18.0 --activate


# # npm registry mirror
# RUN pnpm config set registry https://registry.npmmirror.com

# RUN pnpm config get registry && \
#     pnpm --version && \
#     node --version && \
#     wget -S --spider https://registry.npmmirror.com/@prisma/client/-/client-7.9.1.tgz

    
# COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
# COPY apps ./apps
# COPY packages ./packages
# COPY nx.json tsconfig.base.json eslint.config.mjs ./



# #RUN pnpm install --frozen-lockfile
# # RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
# #     pnpm install --frozen-lockfile

# RUN pnpm install --frozen-lockfile --reporter=ndjson

# RUN npx nx build ${NX_APP_NAME} --configuration=production

# FROM node:22-alpine AS runtime
# ARG NX_APP_NAME
# ENV NX_APP_NAME=${NX_APP_NAME}
# ENV NODE_ENV=production
# ENV HOSTNAME=0.0.0.0
# ENV PORT=3000
# WORKDIR /app

# COPY --from=builder /workspace/apps/${NX_APP_NAME}/.next/standalone ./
# COPY --from=builder /workspace/apps/${NX_APP_NAME}/.next/static ./apps/${NX_APP_NAME}/.next/static
# COPY --from=builder /workspace/apps/${NX_APP_NAME}/public ./apps/${NX_APP_NAME}/public

# EXPOSE 3000
# CMD ["sh", "-c", "node apps/${NX_APP_NAME}/server.js"]






# # syntax=docker/dockerfile:1
# ARG NX_APP_NAME=web

# FROM node:22-alpine AS builder
# ARG NX_APP_NAME
# WORKDIR /workspace

# RUN corepack enable && corepack prepare pnpm@11.18.0 --activate

# COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
# COPY apps ./apps
# COPY packages ./packages
# COPY nx.json tsconfig.base.json eslint.config.mjs ./

# RUN pnpm install --frozen-lockfile --reporter=ndjson

# RUN npx nx build ${NX_APP_NAME} --configuration=production

# FROM node:22-alpine AS runtime
# ARG NX_APP_NAME
# ENV NX_APP_NAME=${NX_APP_NAME}
# ENV NODE_ENV=production
# ENV HOSTNAME=0.0.0.0
# ENV PORT=3000
# WORKDIR /app

# COPY --from=builder /workspace/apps/${NX_APP_NAME}/.next/standalone ./
# COPY --from=builder /workspace/apps/${NX_APP_NAME}/.next/static ./apps/${NX_APP_NAME}/.next/static
# COPY --from=builder /workspace/apps/${NX_APP_NAME}/public ./apps/${NX_APP_NAME}/public

# EXPOSE 3000
# CMD ["sh", "-c", "node apps/${NX_APP_NAME}/server.js"]








# syntax=docker/dockerfile:1
ARG NX_APP_NAME=web

FROM node:22-alpine AS builder
ARG NX_APP_NAME
WORKDIR /workspace

RUN corepack enable && corepack prepare pnpm@11.18.0 --activate

RUN pnpm config set fetch-retries 5 && \
    pnpm config set fetch-retry-mintimeout 20000 && \
    pnpm config set fetch-retry-maxtimeout 120000 && \
    pnpm config set network-concurrency 4

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY apps ./apps
COPY packages ./packages
COPY nx.json tsconfig.base.json eslint.config.mjs ./

RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile
RUN npx nx build ${NX_APP_NAME} --configuration=production

FROM node:22-alpine AS runtime
ARG NX_APP_NAME
ENV NX_APP_NAME=${NX_APP_NAME}
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
WORKDIR /app

COPY --from=builder /workspace/apps/${NX_APP_NAME}/.next/standalone ./
COPY --from=builder /workspace/apps/${NX_APP_NAME}/.next/static ./apps/${NX_APP_NAME}/.next/static
COPY --from=builder /workspace/apps/${NX_APP_NAME}/public ./apps/${NX_APP_NAME}/public

EXPOSE 3000
CMD ["sh", "-c", "node apps/${NX_APP_NAME}/server.js"]
