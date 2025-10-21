import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InfoItem } from './InfoItem';

interface PlanetCharacteristicsProps {
  climate: string;
  gravity: string;
  terrain: string;
  surface_water: string;
}

export function PlanetCharacteristics({
  climate,
  gravity,
  terrain,
  surface_water,
}: PlanetCharacteristicsProps) {
  const formatSurfaceWater = (water: string) => {
    if (water === 'unknown') return 'Unknown';
    return `${water}%`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Characteristics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          <InfoItem label="Climate" value={climate} capitalize />
          <InfoItem label="Gravity" value={gravity} />
          <InfoItem label="Terrain" value={terrain} capitalize />
          <InfoItem
            label="Surface Water"
            value={formatSurfaceWater(surface_water)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
