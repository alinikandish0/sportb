import { PAGINATION_DEFAULTS } from '../constants/pagination.constants';

export interface PrismaPaginationArgs {
  skip: number;
  take: number;
}

/**
 * صفحه/تعداد (که از کوئری کاربر میاد) رو به skip/take که Prisma می‌خواد
 * تبدیل می‌کنه. همینجا هم جلوی مقدار غیرمنطقی (صفحه‌ی منفی، limit خیلی
 * بزرگ) رو می‌گیره.
 *
 * مثال:
 *   const { skip, take } = toPrismaPagination({ page: 2, limit: 20 });
 *   await this.prisma.user.findMany({ skip, take });
 */
export function toPrismaPagination(params: {
  page?: number;
  limit?: number;
}): PrismaPaginationArgs {
  const page = Math.max(params.page ?? PAGINATION_DEFAULTS.PAGE, 1);
  const limit = Math.min(
    Math.max(params.limit ?? PAGINATION_DEFAULTS.LIMIT, 1),
    PAGINATION_DEFAULTS.MAX_LIMIT,
  );

  return {
    skip: (page - 1) * limit,
    take: limit,
  };
}
