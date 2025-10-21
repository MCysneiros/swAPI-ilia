import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';

interface UseQueryParamsResult {
  currentPage: number;
  search: string;
  setCurrentPage: (page: number) => void;
  setSearch: (search: string) => void;
}

export function useQueryParams(defaultPage = 1): UseQueryParamsResult {
  const searchParams = useSearchParams();

  const getPageFromParams = useCallback(() => {
    const pageParam = Number(searchParams.get('page'));
    return Number.isFinite(pageParam) && pageParam > 0
      ? pageParam
      : defaultPage;
  }, [searchParams, defaultPage]);

  const getSearchFromParams = useCallback(
    () => searchParams.get('search') ?? '',
    [searchParams]
  );

  const [currentPage, setCurrentPage] = useState(getPageFromParams);
  const [search, setSearch] = useState(getSearchFromParams);

  useEffect(() => {
    const paramsPage = getPageFromParams();
    const paramsSearch = getSearchFromParams();

    setCurrentPage((prev) => (prev === paramsPage ? prev : paramsPage));
    setSearch((prev) => (prev === paramsSearch ? prev : paramsSearch));
  }, [getPageFromParams, getSearchFromParams]);

  return { currentPage, search, setCurrentPage, setSearch };
}
