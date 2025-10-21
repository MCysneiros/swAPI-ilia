import { Badge } from '@/components/ui/badge';
import type { ResidentDetails } from '../hooks/useResidents';

interface ResidentCardProps {
  resident: ResidentDetails;
}

const genderMap: Record<string, string> = {
  male: 'Male',
  female: 'Female',
  'n/a': 'N/A',
  none: 'None',
  hermaphrodite: 'Hermaphrodite',
};

export function ResidentCard({ resident }: ResidentCardProps) {
  return (
    <div
      className="rounded-lg border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-md"
      data-testid="resident-card"
    >
      <h3 className="mb-3 truncate text-lg font-semibold" title={resident.name}>
        {resident.name}
      </h3>

      <div className="space-y-2 text-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-muted-foreground">Hair:</span>
          <Badge variant="outline" className="capitalize">
            {resident.hair_color}
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-muted-foreground">Eyes:</span>
          <Badge variant="outline" className="capitalize">
            {resident.eye_color}
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-muted-foreground">Gender:</span>
          <Badge variant="outline">
            {genderMap[resident.gender.toLowerCase()] || resident.gender}
          </Badge>
        </div>

        {resident.species.length > 0 && (
          <div>
            <p className="mb-1 text-muted-foreground">Species:</p>
            <div className="flex flex-wrap gap-1">
              {resident.species.map((species, idx) => (
                <Badge key={idx} variant="secondary">
                  {species.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {resident.vehicles.length > 0 && (
          <div>
            <p className="mb-1 text-muted-foreground">Vehicle(s):</p>
            <div className="space-y-1">
              {resident.vehicles.map((vehicle, idx) => (
                <div key={idx} className="rounded bg-muted p-2">
                  <p
                    className="truncate text-xs font-medium"
                    title={vehicle.name}
                  >
                    {vehicle.name}
                  </p>
                  <p
                    className="truncate text-xs text-muted-foreground"
                    title={vehicle.model}
                  >
                    {vehicle.model}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
