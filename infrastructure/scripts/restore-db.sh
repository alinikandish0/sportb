#!/usr/bin/env bash
# infrastructure/scripts/restore-db.sh
#
# یه بکاپ (خروجی backup-db.sh) رو به دیتابیس برمی‌گردونه.
# استفاده: ./restore-db.sh <مسیر فایل .sql.gz>
#
# ⚠️ هشدار: این کار دیتابیس مقصد رو کاملاً بازنویسی می‌کنه.

set -euo pipefail

BACKUP_FILE="${1:-}"
POSTGRES_HOST="${POSTGRES_HOST:-localhost}"
POSTGRES_PORT="${POSTGRES_PORT:-5432}"
POSTGRES_USER="${POSTGRES_USER:-platform}"
POSTGRES_DB="${POSTGRES_DB:-platform}"

if [ -z "$BACKUP_FILE" ]; then
  echo "استفاده: $0 <مسیر فایل بکاپ .sql.gz>" >&2
  exit 1
fi

if [ ! -f "$BACKUP_FILE" ]; then
  echo "❌ فایل بکاپ پیدا نشد: $BACKUP_FILE" >&2
  exit 1
fi

if [ -z "${POSTGRES_PASSWORD:-}" ]; then
  echo "❌ متغیر POSTGRES_PASSWORD ست نشده." >&2
  exit 1
fi

read -r -p "⚠️  این عملیات کل دیتابیس '${POSTGRES_DB}' رو بازنویسی می‌کنه. مطمئنی؟ (yes/no): " CONFIRM
if [ "$CONFIRM" != "yes" ]; then
  echo "لغو شد."
  exit 0
fi

echo "در حال بازگردانی از '$BACKUP_FILE'..."

gunzip -c "$BACKUP_FILE" | PGPASSWORD="$POSTGRES_PASSWORD" psql \
  -h "$POSTGRES_HOST" \
  -p "$POSTGRES_PORT" \
  -U "$POSTGRES_USER" \
  -d "$POSTGRES_DB" \
  --quiet

echo "✅ بازگردانی کامل شد."
