'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { usePlanetDetails } from '@/features/planets';
import { PageContainer } from '@/components/layout';
import { ErrorState } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  PlanetBasicInfo,
  PlanetCharacteristics,
  PlanetFilms,
  PlanetResidents,
  PlanetMetadata,
  PlanetDetailSkeleton,
} from '@/features/planets/components';

interface PlanetDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function PlanetDetailPage({ params }: PlanetDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const {
    data: planet,
    isLoading,
    isFetching,
    isPlaceholderData,
    error,
    refetch,
  } = usePlanetDetails(id);

  const isSyncing = isFetching && !isPlaceholderData && Boolean(planet);
  const handleBackClick = () => {
    if (typeof window !== 'undefined' && window.history.length > 2) {
      router.back();
    } else {
      router.push('/');
    }
  };

  if (isLoading) {
    return (
      <PageContainer>
        <PlanetDetailSkeleton />
      </PageContainer>
    );
  }

  if (error || !planet) {
    return (
      <PageContainer>
        <div className="mb-6">
          <Button variant="ghost" type="button" onClick={handleBackClick}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Planets
          </Button>
        </div>
        <ErrorState
          title="Failed to load planet"
          message="An error occurred while fetching planet details. Please try again."
          onRetry={() => refetch()}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <Button variant="ghost" type="button" onClick={handleBackClick}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Planets
        </Button>

        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {planet.name}
          </h1>
          {isSyncing && (
            <Badge
              variant="outline"
              className="flex items-center gap-1.5"
              data-testid="planet-sync-indicator"
            >
              <Loader2 className="h-3 w-3 animate-spin" />
              Syncing...
            </Badge>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <PlanetBasicInfo
            rotation_period={planet.rotation_period}
            orbital_period={planet.orbital_period}
            diameter={planet.diameter}
            population={planet.population}
          />
          <PlanetCharacteristics
            climate={planet.climate}
            gravity={planet.gravity}
            terrain={planet.terrain}
            surface_water={planet.surface_water}
          />
        </div>

        {planet.films.length > 0 && <PlanetFilms films={planet.films} />}

        {planet.residents.length > 0 && (
          <PlanetResidents residents={planet.residents} />
        )}

        <PlanetMetadata created={planet.created} edited={planet.edited} />
      </div>
    </PageContainer>
  );
}
