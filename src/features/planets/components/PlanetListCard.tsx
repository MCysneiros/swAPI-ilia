'use client';

import Link from 'next/link';
import { Film } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useFilms } from '../hooks/useFilms';
import type { Planet } from '@/types';

interface PlanetListCardProps {
  planet: Planet;
  planetId: string;
}

export function PlanetListCard({ planet, planetId }: PlanetListCardProps) {
  const { data: films = [], isLoading: isLoadingFilms } = useFilms(
    planet.films
  );

  return (
    <Link href={`/planets/${planetId}`}>
      <Card className="h-full transition-colors hover:bg-accent">
        <CardHeader>
          <CardTitle>{planet.name}</CardTitle>
          <CardDescription>
            {planet.terrain} • {planet.climate}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Population:</span>
              <Badge variant="secondary">
                {planet.population !== 'unknown'
                  ? parseInt(planet.population).toLocaleString()
                  : 'Unknown'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Diameter:</span>
              <span>{planet.diameter} km</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Residents:</span>
              <Badge>{planet.residents.length}</Badge>
            </div>

            <div className="border-t pt-3">
              <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                <Film className="h-4 w-4" />
                <span className="text-xs font-medium">Films:</span>
              </div>
              {isLoadingFilms ? (
                <div className="space-y-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ) : films.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {films.map((film, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {film.title}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">No films</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
