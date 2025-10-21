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
    if (water === 'unknown') return 'Desconhecida';
    return `${water}%`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Características</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          <InfoItem label="Clima" value={climate} capitalize />
          <InfoItem label="Gravidade" value={gravity} />
          <InfoItem label="Terreno" value={terrain} capitalize />
          <InfoItem
            label="Água Superficial"
            value={formatSurfaceWater(surface_water)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
