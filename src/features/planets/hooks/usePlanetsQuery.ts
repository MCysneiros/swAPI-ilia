import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { planetsApi } from '../api/planetsApi';
import { queryKeys, PAGINATION } from '@/constants';
import type { ApiResponse, Planet } from '@/types';

interface UsePlanetsQueryParams {
  page: number;
  search: string;
}

export function usePlanetsQuery({ page, search }: UsePlanetsQueryParams) {
  const { data, error, isFetching, isPlaceholderData, status, refetch } =
    useQuery<ApiResponse<Planet>>({
      queryKey: queryKeys.planets.list({ page, search }),
      queryFn: () => planetsApi.getAll({ page, search }),
      placeholderData: (previousData) => previousData,
      staleTime: 60 * 1000,
    });

  const planets = useMemo(
    () =>
      data?.results
        ? [...data.results].sort((a, b) => a.name.localeCompare(b.name))
        : [],
    [data?.results]
  );

  const totalCount = data?.count ?? 0;
  const totalPages =
    totalCount > 0 ? Math.ceil(totalCount / PAGINATION.defaultPageSize) : 1;

  const hasData = planets.length > 0;
  const showSkeleton = status === 'pending' && !hasData && !isPlaceholderData;
  const showErrorState = Boolean(error) && !hasData;
  const showEmptyState =
    !showErrorState && !showSkeleton && !isPlaceholderData && !hasData;
  const isSyncing = isFetching && !isPlaceholderData && hasData;

  const hasNextPage =
    (typeof data?.next === 'string' && data.next.length > 0) ||
    page < totalPages;
  const hasPreviousPage =
    (typeof data?.previous === 'string' && data.previous.length > 0) ||
    page > 1;

  return {
    planets,
    totalCount,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    showSkeleton,
    showErrorState,
    showEmptyState,
    isSyncing,
    refetch,
  };
}
