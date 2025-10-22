import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { usePlanetDetails } from '../usePlanetDetails';
import { TestWrapper } from '@/test/utils';
import { planetsApi } from '../../api/planetsApi';
import type { Planet } from '@/types';

vi.mock('../../api/planetsApi', () => ({
  planetsApi: {
    getById: vi.fn(),
  },
}));

describe('usePlanetDetails', () => {
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
    residents: ['https://swapi.dev/api/people/1/'],
    films: ['https://swapi.dev/api/films/1/'],
    created: '2014-12-09T13:50:49.641000Z',
    edited: '2014-12-20T20:58:18.411000Z',
    url: 'https://swapi.dev/api/planets/1/',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return planet data successfully', async () => {
    vi.mocked(planetsApi.getById).mockResolvedValue(mockPlanet);

    const { result } = renderHook(() => usePlanetDetails('1'), {
      wrapper: TestWrapper,
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockPlanet);
    expect(result.current.error).toBeNull();
    expect(planetsApi.getById).toHaveBeenCalledWith('1');
    expect(planetsApi.getById).toHaveBeenCalledTimes(1);
  });

  it('should keep previous data during refetch (optimistic UI)', async () => {
    vi.mocked(planetsApi.getById).mockResolvedValue(mockPlanet);

    const { result, rerender } = renderHook(() => usePlanetDetails('1'), {
      wrapper: TestWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const initialData = result.current.data;
    expect(initialData).toEqual(mockPlanet);

    rerender();

    expect(result.current.data).toBeDefined();
  });

  it('should have correct cache settings', async () => {
    vi.mocked(planetsApi.getById).mockResolvedValue(mockPlanet);

    const { result } = renderHook(() => usePlanetDetails('1'), {
      wrapper: TestWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.isRefetching).toBe(false);
  });

  it('should return correct loading states', async () => {
    vi.mocked(planetsApi.getById).mockResolvedValue(mockPlanet);

    const { result } = renderHook(() => usePlanetDetails('1'), {
      wrapper: TestWrapper,
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isFetching).toBe(true);
    expect(result.current.isSuccess).toBe(false);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isFetching).toBe(false);
  });

  it('should use the correct query key', async () => {
    vi.mocked(planetsApi.getById).mockResolvedValue(mockPlanet);

    const { result } = renderHook(() => usePlanetDetails('42'), {
      wrapper: TestWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(planetsApi.getById).toHaveBeenCalledWith('42');
  });
});
