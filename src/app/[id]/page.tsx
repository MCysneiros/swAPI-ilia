import { notFound } from 'next/navigation';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { CACHE_CONFIG, queryKeys } from '@/constants';
import {
  planetsServerApi,
  planetsApi,
} from '@/features/planets/api/planetsApi';
import { HydratedPlanetDetail } from './_components/hydrated-planet-detail';

interface PlanetDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PlanetDetailPage({
  params,
}: PlanetDetailPageProps) {
  const { id } = await params;

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: CACHE_CONFIG.staleTime,
        gcTime: CACHE_CONFIG.gcTime,
        refetchOnWindowFocus: CACHE_CONFIG.refetchOnWindowFocus,
        retry: CACHE_CONFIG.retry,
      },
    },
  });

  const planet = await queryClient
    .fetchQuery({
      queryKey: queryKeys.planets.detail(id),
      queryFn: () => planetsServerApi.getById(id),
    })
    .catch((error) => {
      const status = (error as { status?: number })?.status;
      if (status === 404) {
        notFound();
      }
      throw error;
    });

  const filmUrls = planet.films ?? [];

  if (filmUrls.length > 0) {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.films.list({ urls: filmUrls }),
      queryFn: () =>
        Promise.all(filmUrls.map((url) => planetsApi.getFilmByUrl(url))),
    });
  }

  const dehydratedState = dehydrate(queryClient);

  return <HydratedPlanetDetail planetId={id} state={dehydratedState} />;
}
