'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useFilms } from '../hooks/useFilms';
import { FilmCard } from './FilmCard';

interface PlanetFilmsProps {
  films: string[];
}

export function PlanetFilms({ films }: PlanetFilmsProps) {
  const { data: filmsData = [], isLoading } = useFilms(films);
  const sortedFilms = [...filmsData].sort(
    (a, b) => a.episode_id - b.episode_id
  );

  if (films.length === 0) {
    return (
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Films</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This planet does not appear in any films.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Films</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(films.length)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Films ({filmsData.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedFilms.map((film, index) => (
            <FilmCard key={index} film={film} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
