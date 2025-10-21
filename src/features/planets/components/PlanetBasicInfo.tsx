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
    if (pop === 'unknown') return 'Desconhecida';
    const num = parseInt(pop);
    return isNaN(num) ? pop : num.toLocaleString('pt-BR');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações Básicas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          <InfoItem
            label="Período de Rotação"
            value={`${rotation_period} horas`}
          />
          <InfoItem label="Período Orbital" value={`${orbital_period} dias`} />
          <InfoItem label="Diâmetro" value={`${diameter} km`} />
          <InfoItem label="População" value={formatPopulation(population)} />
        </div>
      </CardContent>
    </Card>
  );
}
