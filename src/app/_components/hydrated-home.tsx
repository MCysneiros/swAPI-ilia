'use client';

import { Suspense } from 'react';
import type { DehydratedState } from '@tanstack/react-query';
import { HydrationBoundary } from '@tanstack/react-query';
import { ListSkeleton } from '@/components/shared';
import { HomeContent } from './home-content';

interface HydratedHomeProps {
  state: DehydratedState;
}

export function HydratedHome({ state }: HydratedHomeProps) {
  return (
    <HydrationBoundary state={state}>
      <Suspense fallback={<ListSkeleton count={6} />}>
        <HomeContent />
      </Suspense>
    </HydrationBoundary>
  );
}
