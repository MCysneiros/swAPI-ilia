'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useResidents } from '../hooks/useResidents';
import { ResidentCard } from './ResidentCard';

interface PlanetResidentsProps {
  residents: string[];
}

export function PlanetResidents({ residents }: PlanetResidentsProps) {
  const { data: residentsData = [], isLoading } = useResidents(residents);

  console.log('Residents Data:', residentsData);

  if (residents.length === 0) {
    return (
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Nativos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Este planeta não possui nativos conhecidos.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Nativos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(Math.min(residents.length, 6))].map((_, i) => (
              <Skeleton key={i} className="h-48 w-full rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Nativos ({residentsData.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {residentsData.map((resident, index) => (
            <ResidentCard key={index} resident={resident} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
