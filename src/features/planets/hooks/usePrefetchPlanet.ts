import { useQueryClient } from '@tanstack/react-query';
import { getPlanet } from '../api/planetsApi';

export function usePrefetchPlanet() {
  const queryClient = useQueryClient();

  const prefetchPlanet = (id: string) => {
    queryClient
      .prefetchQuery({
        queryKey: ['planet', id],
        queryFn: () => getPlanet(id),
        staleTime: 5 * 60 * 1000,
      })
      .catch(() => {});
  };

  return { prefetchPlanet };
}
