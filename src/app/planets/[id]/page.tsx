'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { usePlanetDetails } from '@/features/planets';
import { PageContainer } from '@/components/layout';
import { ErrorState } from '@/components/shared';
import { Button } from '@/components/ui/button';
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
  const { data: planet, isLoading, error, refetch } = usePlanetDetails(id);

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
          <Button variant="ghost" asChild>
            <Link href="/planets">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Planets
            </Link>
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
        <Button variant="ghost" asChild>
          <Link href="/planets">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Planets
          </Link>
        </Button>

        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {planet.name}
          </h1>
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
