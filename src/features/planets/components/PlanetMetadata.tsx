import { formatDate } from '@/lib/utils';

interface PlanetMetadataProps {
  created: string;
  edited: string;
}

export function PlanetMetadata({ created, edited }: PlanetMetadataProps) {
  return (
    <div className="mt-6 rounded-lg border bg-muted/50 p-4">
      <div className="grid gap-2 text-sm sm:grid-cols-2">
        <p className="text-muted-foreground">
          <span className="font-medium">Created:</span> {formatDate(created)}
        </p>
        <p className="text-muted-foreground">
          <span className="font-medium">Updated:</span> {formatDate(edited)}
        </p>
      </div>
    </div>
  );
}
