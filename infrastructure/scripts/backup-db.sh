#!/usr/bin/env bash
# infrastructure/scripts/backup-db.sh
#
# یه بکاپ فشرده از دیتابیس Postgres می‌گیره.
# استفاده: ./backup-db.sh [مسیر خروجی، پیش‌فرض: ./backups]
#
# متغیرهای محیطی مورد نیاز (از .env می‌خونتشون اگه ست نشده باشن):
#   POSTGRES_HOST (پیش‌فرض: localhost)
#   POSTGRES_PORT (پیش‌فرض: 5432)
#   POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB

set -euo pipefail

OUTPUT_DIR="${1:-./backups}"
POSTGRES_HOST="${POSTGRES_HOST:-localhost}"
POSTGRES_PORT="${POSTGRES_PORT:-5432}"
POSTGRES_USER="${POSTGRES_USER:-platform}"
POSTGRES_DB="${POSTGRES_DB:-platform}"

if [ -z "${POSTGRES_PASSWORD:-}" ]; then
  echo "❌ متغیر POSTGRES_PASSWORD ست نشده." >&2
  exit 1
fi

mkdir -p "$OUTPUT_DIR"

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
FILENAME="${OUTPUT_DIR}/${POSTGRES_DB}_${TIMESTAMP}.sql.gz"

echo "در حال گرفتن بکاپ از دیتابیس '${POSTGRES_DB}'..."

PGPASSWORD="$POSTGRES_PASSWORD" pg_dump \
  -h "$POSTGRES_HOST" \
  -p "$POSTGRES_PORT" \
  -U "$POSTGRES_USER" \
  -d "$POSTGRES_DB" \
  --no-owner \
  --no-privileges \
  | gzip > "$FILENAME"

SIZE=$(du -h "$FILENAME" | cut -f1)
echo "✅ بکاپ ذخیره شد: $FILENAME ($SIZE)"
