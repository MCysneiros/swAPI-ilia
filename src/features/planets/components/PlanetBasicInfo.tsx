import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InfoItem } from './InfoItem';

interface PlanetBasicInfoProps {
  rotation_period: string;
  orbital_period: string;
  diameter: string;
  population: string;
}

export function PlanetBasicInfo({
  rotation_period,
  orbital_period,
  diameter,
  population,
}: PlanetBasicInfoProps) {
  const formatPopulation = (pop: string) => {
    if (pop === 'unknown') return 'Unknown';
    const num = parseInt(pop);
    return isNaN(num) ? pop : num.toLocaleString('en-US');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          <InfoItem
            label="Rotation Period"
            value={`${rotation_period} hours`}
          />
          <InfoItem label="Orbital Period" value={`${orbital_period} days`} />
          <InfoItem label="Diameter" value={`${diameter} km`} />
          <InfoItem label="Population" value={formatPopulation(population)} />
        </div>
      </CardContent>
    </Card>
  );
}
