'use client';

import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Search } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { planetsApi, PlanetListCard } from '@/features/planets';
import { queryKeys, PAGINATION } from '@/constants';
import { useDebounce } from '@/hooks';
import { PageContainer } from '@/components/layout';
import {
  ListSkeleton,
  ErrorState,
  EmptyState,
  Pagination,
} from '@/components/shared';
import { Input } from '@/components/ui/input';
import type { ApiResponse, Planet } from '@/types';

export default function PlanetsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const getPageFromParams = () => {
    const pageParam = Number(searchParams.get('page'));
    return Number.isFinite(pageParam) && pageParam > 0
      ? pageParam
      : PAGINATION.defaultPage;
  };
  const getSearchFromParams = () => searchParams.get('search') ?? '';
  const [currentPage, setCurrentPage] = useState<number>(
    getPageFromParams
  );
  const [search, setSearch] = useState(getSearchFromParams);
  const debouncedSearch = useDebounce(search, 300);

  const { data, error, isFetching, isPlaceholderData, status, refetch } =
    useQuery<ApiResponse<Planet>>({
      queryKey: queryKeys.planets.list({
        page: currentPage,
        search: debouncedSearch,
      }),
      queryFn: () =>
        planetsApi.getAll({ page: currentPage, search: debouncedSearch }),
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
  const showSkeleton =
    status === 'pending' && planets.length === 0 && !isPlaceholderData;
  const hasData = planets.length > 0;
  const showErrorState = Boolean(error) && !hasData;
  const showEmptyState =
    !showErrorState && !showSkeleton && !isPlaceholderData && !hasData;
  const isSyncing = isFetching && !isPlaceholderData && hasData;
  const hasNextPage =
    (typeof data?.next === 'string' && data.next.length > 0) ||
    currentPage < totalPages;
  const hasPreviousPage =
    (typeof data?.previous === 'string' && data.previous.length > 0) ||
    currentPage > 1;

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (currentPage !== PAGINATION.defaultPage) {
      params.set('page', String(currentPage));
    } else {
      params.delete('page');
    }

    const normalizedSearch = debouncedSearch.trim();
    if (normalizedSearch) {
      params.set('search', normalizedSearch);
    } else {
      params.delete('search');
    }

    const newQuery = params.toString();
    if (newQuery !== searchParams.toString()) {
      const href = newQuery ? `${pathname}?${newQuery}` : pathname;
      router.replace(href, { scroll: false });
    }
  }, [
    currentPage,
    debouncedSearch,
    pathname,
    router,
    searchParams,
  ]);

  useEffect(() => {
    const paramsPage = getPageFromParams();
    const paramsSearch = getSearchFromParams();
    setCurrentPage((prev) => (prev === paramsPage ? prev : paramsPage));
    setSearch((prev) => (prev === paramsSearch ? prev : paramsSearch));
  }, [searchParams]);

  return (
    <PageContainer>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Planets</h1>
          <p className="text-muted-foreground">
            Explore planets from the Star Wars universe
          </p>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search planets..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
              className="pl-10"
              data-testid="planet-search-input"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span data-testid="planets-count">
              {totalCount}{' '}
              {totalCount === 1 ? 'planet found' : 'planets available'}
            </span>
            {isSyncing && (
              <span
                className="flex items-center gap-2 text-primary"
                data-testid="planets-sync-indicator"
              >
                <Loader2 className="h-4 w-4 animate-spin" />
                Updating results...
              </span>
            )}
          </div>
        </div>

        {showSkeleton ? (
          <ListSkeleton count={6} />
        ) : showErrorState ? (
          <ErrorState
            title="Failed to load planets"
            message="An error occurred while fetching planets. Please try again."
            onRetry={() => refetch()}
          />
        ) : showEmptyState ? (
          <EmptyState
            title="No planets found"
            message={
              debouncedSearch
                ? `No planets match "${debouncedSearch}"`
                : 'No planets available'
            }
            actionLabel="Clear search"
            onAction={() => setSearch('')}
          />
        ) : (
          <>
            {isSyncing && !showSkeleton && (
              <div
                className="flex items-center gap-2 rounded-md border border-primary/20 bg-primary/5 px-3 py-2 text-sm text-primary"
                data-testid="planets-live-indicator"
              >
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Syncing with the galaxy...
              </div>
            )}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {planets.map((planet) => {
                const id = planet.url.split('/').filter(Boolean).pop();
                return (
                  <PlanetListCard
                    key={planet.url}
                    planet={planet}
                    planetId={id || ''}
                  />
                );
              })}
            </div>
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                hasNextPage={hasNextPage}
                hasPreviousPage={hasPreviousPage}
                className="mt-8"
              />
            )}
          </>
        )}
      </div>
    </PageContainer>
  );
}
