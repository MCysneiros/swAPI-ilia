import Link from 'next/link';
import { PageContainer } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/shared';

export default function PlanetNotFound() {
  return (
    <PageContainer>
      <div className="space-y-6">
        <Button asChild variant="ghost">
          <Link href="/">Back to Planets</Link>
        </Button>
        <EmptyState
          title="Planet not found"
          message="The planet you are looking for does not exist in the archive."
          actionLabel="Browse planets"
          actionHref="/"
        />
      </div>
    </PageContainer>
  );
}
