import { PageContainer } from '@/components/layout';
import { PlanetDetailSkeleton } from '@/features/planets/components';

export default function PlanetDetailLoading() {
  return (
    <PageContainer>
      <PlanetDetailSkeleton />
    </PageContainer>
  );
}
