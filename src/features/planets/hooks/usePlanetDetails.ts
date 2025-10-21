import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/constants';
import { planetsApi } from '../api/planetsApi';

export function usePlanetDetails(id: string) {
  return useQuery({
    queryKey: queryKeys.planets.detail(id),
    queryFn: () => planetsApi.getById(id),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos (antes era cacheTime)
    retry: 2,
    refetchOnWindowFocus: false,
  });
}
