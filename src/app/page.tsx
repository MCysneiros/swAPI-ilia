'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Rocket, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FadeIn, StaggerChildren, StaggerItem } from '@/components/animations';
import { queryKeys } from '@/constants';
import { planetsApi } from '@/features/planets';
import type { ApiResponse, Planet } from '@/types';

const formatPopulation = (population: string) => {
  if (population === 'unknown') return 'Unknown';
  const value = Number(population);
  return Number.isNaN(value) ? population : value.toLocaleString('en-US');
};

export default function Home() {
  const { data, isFetching, isPlaceholderData } = useQuery<ApiResponse<Planet>>(
    {
      queryKey: queryKeys.planets.list({ page: 1 }),
      queryFn: () => planetsApi.getAll({ page: 1 }),
      placeholderData: (previousData) => previousData,
      staleTime: 60 * 1000,
    }
  );

  const featuredPlanets = useMemo(
    () => (data?.results ?? []).slice(0, 3),
    [data?.results]
  );
  const heroPlanet = featuredPlanets[0];
  const isSyncing = isFetching && !isPlaceholderData;

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
      <section className="relative flex flex-1 flex-col overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/10 via-background to-background" />
        <div className="absolute -left-24 top-20 -z-10 h-64 w-64 rounded-full bg-primary/20 blur-3xl sm:h-80 sm:w-80" />
        <div className="absolute -right-24 bottom-10 -z-10 h-52 w-52 rounded-full bg-sky-400/20 blur-3xl sm:h-72 sm:w-72" />

        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 py-12 sm:py-16 md:py-24">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="text-center lg:text-left">
              <FadeIn delay={0.1}>
                <Badge
                  variant="secondary"
                  className="mb-4 inline-flex items-center gap-2"
                >
                  <Rocket className="h-3.5 w-3.5" />
                  Powered by SWAPI in real-time
                </Badge>
              </FadeIn>

              <FadeIn delay={0.2}>
                <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                  Explore living worlds from the{' '}
                  <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Star Wars
                  </span>{' '}
                  galaxy
                </h1>
              </FadeIn>

              <FadeIn delay={0.3}>
                <p className="mx-auto mb-8 max-w-2xl text-base text-muted-foreground sm:text-lg md:text-xl">
                  Each planet arrives instantly with authentic data: climate,
                  population, residents and film appearances. No waiting — just
                  fluid exploration.
                </p>
              </FadeIn>

              <FadeIn delay={0.4}>
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
                  <Button size="lg" asChild className="w-full sm:w-auto">
                    <Link href="/planets">
                      Explore Planets
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                    className="w-full sm:w-auto"
                  >
                    <Link href="https://swapi.dev" target="_blank">
                      About SWAPI
                    </Link>
                  </Button>
                </div>
              </FadeIn>
            </div>

            {heroPlanet && (
              <FadeIn delay={0.2} className="lg:justify-self-end">
                <Card className="relative overflow-hidden border-primary/20 bg-background/80 shadow-lg backdrop-blur">
                  <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <CardTitle className="text-2xl font-bold">
                          {heroPlanet.name}
                        </CardTitle>
                        <CardDescription>
                          {heroPlanet.terrain} • {heroPlanet.climate}
                        </CardDescription>
                      </div>
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        {isSyncing ? (
                          <>
                            <Loader2 className="h-3 w-3 animate-spin" />
                            live
                          </>
                        ) : (
                          'synced'
                        )}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Population</p>
                        <p className="font-semibold text-foreground">
                          {formatPopulation(heroPlanet.population)}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Diameter</p>
                        <p className="font-semibold text-foreground">
                          {heroPlanet.diameter} km
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Rotation</p>
                        <p className="font-semibold text-foreground">
                          {heroPlanet.rotation_period} h
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Orbital</p>
                        <p className="font-semibold text-foreground">
                          {heroPlanet.orbital_period} days
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-1 rounded-lg border border-primary/20 px-3 py-2 text-sm">
                      <div>
                        <p className="font-medium text-foreground">
                          Appears in films
                        </p>
                        <p className="text-muted-foreground">
                          {heroPlanet.films.length}{' '}
                          {heroPlanet.films.length === 1
                            ? 'production'
                            : 'productions'}
                        </p>
                      </div>
                      <Button size="sm" variant="secondary" asChild>
                        <Link
                          href={`/planets/${heroPlanet.url.split('/').filter(Boolean).pop() ?? ''}`}
                        >
                          View details
                          <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            )}
          </div>
        </div>
      </section>

      {featuredPlanets.length > 0 && (
        <section className="px-4 pb-12 sm:pb-16">
          <div className="mx-auto max-w-6xl">
            <FadeIn>
              <div className="mb-10 flex flex-col gap-4 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
                <div>
                  <h2 className="text-2xl font-bold sm:text-3xl">
                    Featured discoveries
                  </h2>
                  <p className="text-muted-foreground">
                    A snapshot of the most visited worlds — updated as soon as
                    you arrive.
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="justify-center sm:justify-start"
                >
                  {isSyncing ? 'Syncing data in real-time' : 'Data updated'}
                </Badge>
              </div>
            </FadeIn>

            <StaggerChildren className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featuredPlanets.map((planet: Planet) => {
                const planetId =
                  planet.url.split('/').filter(Boolean).pop() ??
                  planet.name.toLowerCase();
                return (
                  <StaggerItem key={planet.url}>
                    <Link
                      href={`/planets/${planetId}`}
                      className="group block h-full"
                    >
                      <Card className="relative h-full overflow-hidden border-border/60 bg-background/80 transition-all hover:border-primary/40 hover:shadow-lg">
                        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-10">
                          <div className="h-full w-full bg-gradient-to-br from-primary/40 via-transparent to-transparent" />
                        </div>
                        <CardHeader>
                          <div className="mb-3 flex items-start justify-between gap-2">
                            <div>
                              <CardTitle className="text-xl font-semibold text-foreground">
                                {planet.name}
                              </CardTitle>
                              <CardDescription>
                                {planet.terrain} • {planet.climate}
                              </CardDescription>
                            </div>
                            <Badge variant="secondary">
                              {formatPopulation(planet.population)}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                          <div className="flex items-center justify-between text-muted-foreground">
                            <span>Rotation</span>
                            <span className="font-medium text-foreground">
                              {planet.rotation_period} h
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-muted-foreground">
                            <span>Orbit</span>
                            <span className="font-medium text-foreground">
                              {planet.orbital_period} days
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-muted-foreground">
                            <span>Residents</span>
                            <span className="font-medium text-foreground">
                              {planet.residents.length}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-muted-foreground">
                            <span>Films</span>
                            <span className="font-medium text-foreground">
                              {planet.films.length}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </StaggerItem>
                );
              })}
            </StaggerChildren>
          </div>
        </section>
      )}

      <section className="border-t px-4 py-12">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="mb-6 text-xl font-semibold sm:text-2xl">
            Built with modern technologies
          </h2>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {[
              'Next.js 15',
              'TypeScript',
              'React Query',
              'Tailwind CSS',
              'Shadcn/ui',
              'Vitest',
              'Playwright',
            ].map((tech) => (
              <Badge
                key={tech}
                variant="secondary"
                className="px-3 py-1 sm:px-4 sm:py-2"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
