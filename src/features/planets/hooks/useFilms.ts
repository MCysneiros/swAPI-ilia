import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/constants';
import { planetsApi } from '../api/planetsApi';

export function useFilms(filmUrls: string[]) {
  return useQuery({
    queryKey: queryKeys.films.list({ urls: filmUrls }),
    queryFn: async () => {
      if (filmUrls.length === 0) return [];
      return Promise.all(filmUrls.map((url) => planetsApi.getFilmByUrl(url)));
    },
    enabled: filmUrls.length > 0,
    staleTime: 30 * 60 * 1000, // 30 minutos (filmes mudam raramente)
    gcTime: 60 * 60 * 1000, // 1 hora
    retry: 2,
    refetchOnWindowFocus: false,
  });
}
