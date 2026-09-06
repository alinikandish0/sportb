#!/usr/bin/env bash
# infrastructure/scripts/migrate-deploy.sh
#
# برای استفاده توی CI/CD یا اسکریپت deploy: صبر می‌کنه Postgres آماده بشه،
# بعد migration های pending رو با prisma migrate deploy اجرا می‌کنه.
# (بر خلاف `migrate dev`، این دستور migration جدید نمی‌سازه — فقط
# migration های موجود رو روی دیتابیس اعمال می‌کنه. برای production درسته.)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

"$SCRIPT_DIR/wait-for-postgres.sh" "${1:-60}"

echo "در حال اجرای migration های pending..."
npx prisma migrate deploy

echo "✅ migration ها با موفقیت اعمال شدن."
