'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { PageContainer } from '@/components/layout';
import { ErrorState } from '@/components/shared';
import { Button } from '@/components/ui/button';

interface PlanetErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function PlanetError({ error, reset }: PlanetErrorProps) {
  useEffect(() => {
    console.error('Planet detail error:', error);
  }, [error]);

  return (
    <PageContainer>
      <div className="space-y-6">
        <Button asChild variant="ghost">
          <Link href="/">Back to Planets</Link>
        </Button>
        <ErrorState
          title="Failed to load planet"
          message="We couldn't fetch the planet details. Please try again."
          onRetry={reset}
        />
      </div>
    </PageContainer>
  );
}
