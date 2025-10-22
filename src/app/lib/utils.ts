import { PAGINATION } from '@/constants';
import { SearchParams } from 'next/dist/server/request/search-params';

export function getPage(searchParams?: SearchParams) {
  const rawPage = searchParams?.page;
  const pageParam =
    typeof rawPage === 'string'
      ? Number(rawPage)
      : Array.isArray(rawPage)
        ? Number(rawPage[0])
        : NaN;

  return Number.isFinite(pageParam) && pageParam > 0
    ? pageParam
    : PAGINATION.defaultPage;
}

export function getSearch(searchParams?: SearchParams) {
  const rawSearch = searchParams?.search;
  if (typeof rawSearch === 'string') {
    return rawSearch;
  }

  if (Array.isArray(rawSearch)) {
    return rawSearch[0] ?? '';
  }

  return '';
}
