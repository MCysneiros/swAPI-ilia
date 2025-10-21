import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePrefetchPlanet } from '../usePrefetchPlanet';
import { planetsServerApi } from '../../api/planetsApi';

vi.mock('../../api/planetsApi', () => ({
  planetsServerApi: {
    getById: vi.fn(),
  },
  getPlanet: vi.fn(),
}));

describe('usePrefetchPlanet', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('should return prefetchPlanet function', () => {
    const { result } = renderHook(() => usePrefetchPlanet(), { wrapper });

    expect(result.current.prefetchPlanet).toBeInstanceOf(Function);
  });

  it('should not fail if prefetch has an error', async () => {
    vi.mocked(planetsServerApi.getById).mockRejectedValue(
      new Error('Network error')
    );

    const { result } = renderHook(() => usePrefetchPlanet(), { wrapper });

    expect(() => result.current.prefetchPlanet('999')).not.toThrow();

    await new Promise((resolve) => setTimeout(resolve, 100));
  });
});
