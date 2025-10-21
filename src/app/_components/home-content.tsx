'use client';

import { Loader2, Search } from 'lucide-react';
import { PlanetListCard, useHomePlanets } from '@/features/planets';
import { PageContainer } from '@/components/layout';
import {
  ListSkeleton,
  ErrorState,
  EmptyState,
  Pagination,
} from '@/components/shared';
import { Input } from '@/components/ui/input';

export function HomeContent() {
  const {
    search,
    debouncedSearch,
    currentPage,
    onSearchChange,
    onClearSearch,
    onPageChange,
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
  } = useHomePlanets();

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
              onChange={(e) => onSearchChange(e.target.value)}
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
            onAction={onClearSearch}
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
                onPageChange={onPageChange}
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
