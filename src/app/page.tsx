import { QueryClient, dehydrate } from '@tanstack/react-query';
import { CACHE_CONFIG, queryKeys } from '@/constants';
import { getPlanets } from '@/features/planets/api/planetsApi';
import { HydratedHome } from './_components/hydrated-home';
import { getPage, getSearch } from './lib/utils';

type SearchParams = Record<string, string | string[] | undefined>;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedSearchParams = await searchParams;

  const page = getPage(resolvedSearchParams);
  const search = getSearch(resolvedSearchParams);

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

  await queryClient.prefetchQuery({
    queryKey: queryKeys.planets.list({ page, search }),
    queryFn: () => getPlanets(page, search || undefined),
  });

  const dehydratedState = dehydrate(queryClient);

  return <HydratedHome state={dehydratedState} />;
}
