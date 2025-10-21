import { describe, it, expect, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '@/test/mocks/server';
import { createTestQueryClient } from '@/test/utils';
import { QueryClientProvider } from '@tanstack/react-query';
import { usePlanetsQuery } from '../usePlanetsQuery';
import type { Planet } from '@/types';

const baseURL = 'https://swapi.dev/api';

const mockPlanets: Planet[] = [
  {
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
  },
  {
    name: 'Alderaan',
    rotation_period: '24',
    orbital_period: '364',
    diameter: '12500',
    climate: 'temperate',
    gravity: '1 standard',
    terrain: 'grasslands, mountains',
    surface_water: '40',
    population: '2000000000',
    residents: [],
    films: [],
    created: '2014-12-10T11:35:48.479000Z',
    edited: '2014-12-20T20:58:18.420000Z',
    url: 'https://swapi.dev/api/planets/2/',
  },
  {
    name: 'Hoth',
    rotation_period: '23',
    orbital_period: '549',
    diameter: '7200',
    climate: 'frozen',
    gravity: '1.1 standard',
    terrain: 'tundra, ice caves, mountain ranges',
    surface_water: '100',
    population: 'unknown',
    residents: [],
    films: [],
    created: '2014-12-10T11:39:13.934000Z',
    edited: '2014-12-20T20:58:18.423000Z',
    url: 'https://swapi.dev/api/planets/3/',
  },
];

describe('usePlanetsQuery', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => {
    const queryClient = createTestQueryClient();
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  afterEach(() => {
    server.resetHandlers();
  });

  it('should fetch and sort planets alphabetically', async () => {
    const { result } = renderHook(
      () => usePlanetsQuery({ page: 1, search: '' }),
      { wrapper }
    );

    await waitFor(() =>
      expect(result.current.planets.length).toBeGreaterThan(0)
    );

    // Should be sorted alphabetically (using default MSW data)
    const planetNames = result.current.planets.map((p) => p.name);
    const sortedNames = [...planetNames].sort();
    expect(planetNames).toEqual(sortedNames);
  });

  it('should calculate total count and pages correctly', async () => {
    const { result } = renderHook(
      () => usePlanetsQuery({ page: 1, search: '' }),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.totalCount).toBeGreaterThan(0);
      expect(result.current.totalPages).toBeGreaterThanOrEqual(1);
    });
  });

  it('should show skeleton when loading initial data', () => {
    // Mock a delayed response
    server.use(
      http.get(`${baseURL}/planets/`, () => {
        return new Promise(() => {}); // Never resolves
      })
    );

    const { result } = renderHook(
      () => usePlanetsQuery({ page: 1, search: '' }),
      { wrapper }
    );

    expect(result.current.showSkeleton).toBe(true);
    expect(result.current.showErrorState).toBe(false);
    expect(result.current.showEmptyState).toBe(false);
  });

  it('should show error state when fetch fails', async () => {
    // Mock a network error
    server.use(
      http.get(`${baseURL}/planets/`, () => {
        return HttpResponse.error();
      })
    );

    const { result } = renderHook(
      () => usePlanetsQuery({ page: 1, search: '' }),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.showErrorState).toBe(true);
      expect(result.current.showSkeleton).toBe(false);
      expect(result.current.showEmptyState).toBe(false);
    });
  });

  it('should show empty state when no results', async () => {
    // Mock empty results
    server.use(
      http.get(`${baseURL}/planets/`, () => {
        return HttpResponse.json({
          count: 0,
          next: null,
          previous: null,
          results: [],
        });
      })
    );

    const { result } = renderHook(
      () => usePlanetsQuery({ page: 1, search: 'nonexistent' }),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.showEmptyState).toBe(true);
      expect(result.current.showSkeleton).toBe(false);
      expect(result.current.showErrorState).toBe(false);
    });
  });

  it('should filter planets by search query', async () => {
    const { result } = renderHook(
      () => usePlanetsQuery({ page: 1, search: 'tat' }),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.planets.length).toBeGreaterThan(0);
      expect(result.current.planets[0].name.toLowerCase()).toContain('tat');
    });
  });

  it('should calculate hasNextPage correctly', async () => {
    // Mock response with next page
    server.use(
      http.get(`${baseURL}/planets/`, () => {
        return HttpResponse.json({
          count: 20,
          next: 'https://swapi.dev/api/planets/?page=2',
          previous: null,
          results: mockPlanets,
        });
      })
    );

    const { result } = renderHook(
      () => usePlanetsQuery({ page: 1, search: '' }),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.hasNextPage).toBe(true);
    });
  });

  it('should calculate hasPreviousPage correctly', async () => {
    // Mock response with previous page
    server.use(
      http.get(`${baseURL}/planets/`, () => {
        return HttpResponse.json({
          count: 20,
          next: null,
          previous: 'https://swapi.dev/api/planets/?page=1',
          results: mockPlanets,
        });
      })
    );

    const { result } = renderHook(
      () => usePlanetsQuery({ page: 2, search: '' }),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.hasPreviousPage).toBe(true);
    });
  });

  it('should handle refetch', async () => {
    const { result } = renderHook(
      () => usePlanetsQuery({ page: 1, search: '' }),
      { wrapper }
    );

    await waitFor(() =>
      expect(result.current.planets.length).toBeGreaterThan(0)
    );

    const initialPlanets = result.current.planets;

    await result.current.refetch();

    // Data should still be present after refetch
    expect(result.current.planets).toEqual(initialPlanets);
  });

  it('should handle search query correctly', async () => {
    const { result } = renderHook(
      () => usePlanetsQuery({ page: 1, search: 'alderaan' }),
      { wrapper }
    );

    await waitFor(() => {
      expect(
        result.current.planets.some((p) =>
          p.name.toLowerCase().includes('alderaan')
        )
      ).toBe(true);
    });
  });

  it('should return empty array when loading', () => {
    // Mock a delayed response
    server.use(
      http.get(`${baseURL}/planets/`, () => {
        return new Promise(() => {});
      })
    );

    const { result } = renderHook(
      () => usePlanetsQuery({ page: 1, search: '' }),
      { wrapper }
    );

    expect(result.current.planets).toEqual([]);
    expect(result.current.showSkeleton).toBe(true);
  });
});
