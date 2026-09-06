#!/usr/bin/env bash
# infrastructure/scripts/wait-for-postgres.sh
#
# منتظر می‌مونه تا Postgres واقعاً آماده‌ی اتصال بشه، بعد دستور بعدی رو اجرا می‌کنه.
# مفید برای CI/CD یا اسکریپت‌های deploy که خارج از docker-compose (که خودش
# healthcheck داره) اجرا میشن.
#
# استفاده: ./wait-for-postgres.sh [حداکثر ثانیه انتظار، پیش‌فرض: 60]

set -euo pipefail

POSTGRES_HOST="${POSTGRES_HOST:-localhost}"
POSTGRES_PORT="${POSTGRES_PORT:-5432}"
POSTGRES_USER="${POSTGRES_USER:-platform}"
MAX_WAIT="${1:-60}"

echo "در حال انتظار برای Postgres روی ${POSTGRES_HOST}:${POSTGRES_PORT} ..."

ELAPSED=0
until pg_isready -h "$POSTGRES_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USER" > /dev/null 2>&1; do
  if [ "$ELAPSED" -ge "$MAX_WAIT" ]; then
    echo "❌ بعد از ${MAX_WAIT} ثانیه، Postgres هنوز آماده نیست." >&2
    exit 1
  fi
  sleep 1
  ELAPSED=$((ELAPSED + 1))
done

echo "✅ Postgres آماده‌ست (بعد از ${ELAPSED} ثانیه)."
