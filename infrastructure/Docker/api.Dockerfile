# syntax=docker/dockerfile:1

FROM node:22-alpine AS builder
WORKDIR /workspace

RUN corepack enable && corepack prepare pnpm@11.18.0 --activate

# روی شبکه‌های کند/ناپایدار (مثل خیلی از ISPهای ایران) fetch از npm registry
# ممکنه timeout بخوره. این تنظیمات retry رو بیشتر و concurrency رو کمتر می‌کنن
# تا شانس موفقیت بالاتر بره.
RUN pnpm config set fetch-retries 5 && \
    pnpm config set fetch-retry-mintimeout 20000 && \
    pnpm config set fetch-retry-maxtimeout 120000 && \
    pnpm config set network-concurrency 4

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY apps ./apps
COPY packages ./packages
COPY prisma ./prisma
COPY prisma.config.ts ./
COPY nx.json tsconfig.base.json eslint.config.mjs ./

# با cache mount، پکیج‌هایی که قبلاً دانلود شدن دوباره از رجیستری گرفته نمیشن —
# فقط بار اول کامل کنده، build های بعدی خیلی سریع‌تر میشن.
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# prisma generate برای validate کردن schema به یه DATABASE_URL نیاز داره
# (حتی اگه واقعاً بهش وصل نشه) — یه مقدار placeholder کافیه.
ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"
RUN npx prisma generate

# pnpm فایل‌های تولیدشده رو داخل ساختار تو در توی خودش (.pnpm/@prisma+client@...)
# می‌ذاره، نه مستقیم node_modules/.prisma. این پیداش می‌کنه و به یه مسیر ثابت
# کپی می‌کنه تا runtime stage بدون حدس زدن مسیر داخلی pnpm بتونه ازش استفاده کنه.
SHELL ["/bin/ash", "-o", "pipefail", "-c"]
RUN set -eux; \
    PRISMA_CLIENT_DIR=$(find /workspace/node_modules -type d -name client | grep '\.prisma/client$' | head -n 1); \
    echo "Found generated Prisma client at: $PRISMA_CLIENT_DIR"; \
    test -n "$PRISMA_CLIENT_DIR"; \
    mkdir -p /workspace/.prisma-output; \
    cp -r "$PRISMA_CLIENT_DIR" /workspace/.prisma-output/client

RUN npx nx build api --configuration=production

FROM node:22-alpine AS runtime
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
WORKDIR /app

COPY --from=builder /workspace/dist/apps/api ./

RUN npm install --omit=dev --no-audit --no-fund

# فایل‌های واقعی Prisma Client (تولیدشده بر اساس schema ما) رو از مسیر ثابتی
# که تو مرحله‌ی قبل نرمالایز کردیم میاریم.
COPY --from=builder /workspace/.prisma-output/client /app/node_modules/.prisma/client

EXPOSE 3000
CMD ["node", "main.js"]
