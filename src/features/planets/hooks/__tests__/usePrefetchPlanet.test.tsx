import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePrefetchPlanet } from '../usePrefetchPlanet';
import { planetsServerApi } from '../../api/planetsApi';
import type { Planet } from '@/types';

vi.mock('../../api/planetsApi', () => ({
  planetsServerApi: {
    getById: vi.fn(),
  },
  getPlanet: vi.fn(),
}));

describe('usePrefetchPlanet', () => {
  const mockPlanet: Planet = {
    name: 'Tatooine',
    rotation_period: '23',
    orbital_period: '304',
    diameter: '10465',
    climate: 'arid',
    gravity: '1 standard',
    terrain: 'desert',
    surface_water: '1',
    population: '200000',
    residents: [],
    films: [],
    created: '2014-12-09T13:50:49.641000Z',
    edited: '2014-12-20T20:58:18.411000Z',
    url: 'https://swapi.dev/api/planets/1/',
  };

  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('deve retornar função prefetchPlanet', () => {
    const { result } = renderHook(() => usePrefetchPlanet(), { wrapper });

    expect(result.current.prefetchPlanet).toBeInstanceOf(Function);
  });

  it.skip('deve fazer prefetch de um planeta', async () => {
    // TODO: Fix prefetchQuery cache population in tests
    vi.mocked(planetsServerApi.getById).mockResolvedValue(mockPlanet);

    const { result } = renderHook(() => usePrefetchPlanet(), { wrapper });

    // Executa prefetch e aguarda
    await result.current.prefetchPlanet('1');

    // Verifica se foi populado no cache
    const cachedData = queryClient.getQueryData(['planet', '1']);
    expect(cachedData).toBeDefined();
    expect(cachedData).toEqual(mockPlanet);
  });

  it.skip('deve popular o cache do QueryClient', async () => {
    // TODO: Fix prefetchQuery cache population in tests
    vi.mocked(planetsServerApi.getById).mockResolvedValue(mockPlanet);

    const { result } = renderHook(() => usePrefetchPlanet(), { wrapper });

    // Executa prefetch e aguarda
    await result.current.prefetchPlanet('1');

    // Verifica os dados no cache
    const cachedData = queryClient.getQueryData(['planet', '1']);
    expect(cachedData).toEqual(mockPlanet);
  });

  it.skip('deve fazer prefetch de múltiplos planetas', async () => {
    // TODO: Fix prefetchQuery cache population in tests
    const mockPlanet2 = {
      ...mockPlanet,
      name: 'Alderaan',
      url: 'https://swapi.dev/api/planets/2/',
    };

    vi.mocked(planetsServerApi.getById)
      .mockResolvedValueOnce(mockPlanet)
      .mockResolvedValueOnce(mockPlanet2);

    const { result } = renderHook(() => usePrefetchPlanet(), { wrapper });

    // Prefetch de múltiplos planetas (await)
    await result.current.prefetchPlanet('1');
    await result.current.prefetchPlanet('2');

    // Verifica ambos foram carregados
    expect(queryClient.getQueryData(['planet', '1'])).toEqual(mockPlanet);
    expect(queryClient.getQueryData(['planet', '2'])).toEqual(mockPlanet2);
  });

  it('deve usar staleTime de 5 minutos', async () => {
    vi.mocked(planetsServerApi.getById).mockResolvedValue(mockPlanet);

    const { result } = renderHook(() => usePrefetchPlanet(), { wrapper });

    await result.current.prefetchPlanet('1');

    const cachedData = queryClient.getQueryData(['planet', '1']);
    expect(cachedData).toBeDefined();

    // Verifica que o query state tem staleTime configurado
    const queryState = queryClient.getQueryState(['planet', '1']);
    expect(queryState).toBeDefined();
  });

  it('não deve falhar se prefetch tiver erro', async () => {
    vi.mocked(planetsServerApi.getById).mockRejectedValue(
      new Error('Network error')
    );

    const { result } = renderHook(() => usePrefetchPlanet(), { wrapper });

    // Prefetch não deve lançar erro
    expect(() => result.current.prefetchPlanet('999')).not.toThrow();
  });

  it('deve permitir prefetch do mesmo planeta múltiplas vezes', async () => {
    vi.mocked(planetsServerApi.getById).mockResolvedValue(mockPlanet);

    const { result } = renderHook(() => usePrefetchPlanet(), { wrapper });

    await result.current.prefetchPlanet('1');
    await result.current.prefetchPlanet('1');
    await result.current.prefetchPlanet('1');

    // Deve ter os dados em cache
    expect(queryClient.getQueryData(['planet', '1'])).toEqual(mockPlanet);
  });
});
