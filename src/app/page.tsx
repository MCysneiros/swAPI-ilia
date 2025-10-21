import { QueryClient, dehydrate } from '@tanstack/react-query';
import { CACHE_CONFIG, PAGINATION, queryKeys } from '@/constants';
import { getPlanets, planetsApi } from '@/features/planets/api/planetsApi';
import { HydratedHome } from './_components/hydrated-home';

type SearchParams = Record<string, string | string[] | undefined>;

function getPage(searchParams?: SearchParams) {
  const rawPage = searchParams?.page;
  const pageParam =
    typeof rawPage === 'string'
      ? Number(rawPage)
      : Array.isArray(rawPage)
        ? Number(rawPage[0])
        : NaN;

  return Number.isFinite(pageParam) && pageParam > 0
    ? pageParam
    : PAGINATION.defaultPage;
}

function getSearch(searchParams?: SearchParams) {
  const rawSearch = searchParams?.search;
  if (typeof rawSearch === 'string') {
    return rawSearch;
  }

  if (Array.isArray(rawSearch)) {
    return rawSearch[0] ?? '';
  }

  return '';
}

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

  const planetsData = await queryClient.fetchQuery({
    queryKey: queryKeys.planets.list({ page, search }),
    queryFn: () => getPlanets(page, search || undefined),
  });

  const filmPrefetches =
    planetsData?.results
      ?.filter((planet) => planet.films.length > 0)
      .map((planet) =>
        queryClient.prefetchQuery({
          queryKey: queryKeys.films.list({ urls: planet.films }),
          queryFn: () =>
            Promise.all(
              planet.films.map((url) => planetsApi.getFilmByUrl(url))
            ),
        })
      ) ?? [];

  await Promise.all(filmPrefetches);

  const dehydratedState = dehydrate(queryClient);

  return <HydratedHome state={dehydratedState} />;
}
