import { FileQuestion } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface EmptyStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({
  title = 'No results found',
  message = 'There is no data to display at this time.',
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <FileQuestion className="mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="mb-2 text-lg font-semibold">{title}</h3>
        <p className="mb-4 text-center text-sm text-muted-foreground">
          {message}
        </p>
        {actionLabel && (actionHref || onAction) && (
          <>
            {actionHref ? (
              <Button asChild>
                <Link href={actionHref}>{actionLabel}</Link>
              </Button>
            ) : (
              <Button onClick={onAction}>{actionLabel}</Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
