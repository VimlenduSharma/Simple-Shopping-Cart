export type PaginationInput = {
  page?: number;        // 1-based page index (defaults to 1)
  limit?: number;       // items per page     (defaults to 20)
  maxLimit?: number;    // hard upper-bound   (defaults to 100)
};

export type PaginationCalc = {
  page: number;         // validated 1-based page
  limit: number;        // validated per-page
  skip: number;         // offset to feed into Prisma
  take: number;         // same as limit (alias for Prisma)
};

export function calculatePagination(
  { page = 1, limit = 20, maxLimit = 100 }: PaginationInput = {},
): PaginationCalc {
  const safePage  = Math.max(1, Math.floor(page));
  const safeLimit = Math.min(maxLimit, Math.max(1, Math.floor(limit)));

  return {
    page: safePage,
    limit: safeLimit,
    skip: (safePage - 1) * safeLimit,
    take: safeLimit,
  };
}

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  pageCount: number;
};

export function buildMeta(
  total: number,
  { page, limit }: Pick<PaginationCalc, 'page' | 'limit'>,
): PaginationMeta {
  return {
    page,
    limit,
    total,
    pageCount: Math.max(1, Math.ceil(total / limit)),
  };
}