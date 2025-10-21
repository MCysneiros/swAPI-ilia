import { useCallback } from 'react';
import { PAGINATION } from '@/constants';
import { useDebounce, useQueryParams, useUrlSync } from '@/hooks';
import { usePlanetsQuery } from './usePlanetsQuery';

const DEBOUNCE_DELAY = 300;

export function useHomePlanets() {
  const { currentPage, search, setCurrentPage, setSearch } = useQueryParams(
    PAGINATION.defaultPage
  );
  const debouncedSearch = useDebounce(search, DEBOUNCE_DELAY);

  useUrlSync({
    page: currentPage,
    search: debouncedSearch,
    defaultPage: PAGINATION.defaultPage,
  });

  const queryResult = usePlanetsQuery({
    page: currentPage,
    search: debouncedSearch,
  });

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearch(value);
      setCurrentPage(PAGINATION.defaultPage);
    },
    [setSearch, setCurrentPage]
  );

  const handleClearSearch = useCallback(() => {
    setSearch('');
    setCurrentPage(PAGINATION.defaultPage);
  }, [setSearch, setCurrentPage]);

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
    },
    [setCurrentPage]
  );

  return {
    search,
    debouncedSearch,
    currentPage,
    onSearchChange: handleSearchChange,
    onClearSearch: handleClearSearch,
    onPageChange: handlePageChange,
    ...queryResult,
  };
}
