'use client';

import { Suspense } from 'react';
import type { DehydratedState } from '@tanstack/react-query';
import { HydrationBoundary } from '@tanstack/react-query';
import { PlanetDetailContent } from './planet-detail-content';
import { PlanetDetailSkeleton } from '@/features/planets/components';

interface HydratedPlanetDetailProps {
  planetId: string;
  state: DehydratedState;
}

export function HydratedPlanetDetail({
  planetId,
  state,
}: HydratedPlanetDetailProps) {
  return (
    <HydrationBoundary state={state}>
      <Suspense fallback={<PlanetDetailSkeleton />}>
        <PlanetDetailContent planetId={planetId} />
      </Suspense>
    </HydrationBoundary>
  );
}
