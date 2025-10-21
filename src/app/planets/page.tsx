'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
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

export default function PlanetsPage() {
  const [currentPage, setCurrentPage] = useState<number>(
    PAGINATION.defaultPage
  );
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.planets.list({
      page: currentPage,
      search: debouncedSearch,
    }),
    queryFn: () =>
      planetsApi.getAll({ page: currentPage, search: debouncedSearch }),
  });

  const planets = (data?.results || []).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / 10); // SWAPI retorna 10 por página

  return (
    <PageContainer>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Planets</h1>
          <p className="text-muted-foreground">
            Explore planets from the Star Wars universe
          </p>
        </div>

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
          />
        </div>

        {isLoading ? (
          <ListSkeleton count={6} />
        ) : error ? (
          <ErrorState
            title="Failed to load planets"
            message="An error occurred while fetching planets. Please try again."
            onRetry={() => refetch()}
          />
        ) : planets.length === 0 ? (
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
                className="mt-8"
              />
            )}
          </>
        )}
      </div>
    </PageContainer>
  );
}
