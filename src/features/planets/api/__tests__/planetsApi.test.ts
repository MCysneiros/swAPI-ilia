import { describe, it, expect, beforeEach, vi } from 'vitest';
import { planetsApi, getPlanet, getPlanets } from '../planetsApi';
import { apiClient } from '@/lib/api';
import type { Planet, ApiResponse } from '@/types';

// Mock apiClient
vi.mock('@/lib/api', () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

describe('planetsApi (Client-side)', () => {
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
    residents: [
      'https://swapi.dev/api/people/1/',
      'https://swapi.dev/api/people/2/',
    ],
    films: ['https://swapi.dev/api/films/1/'],
    created: '2014-12-09T13:50:49.641000Z',
    edited: '2014-12-20T20:58:18.411000Z',
    url: 'https://swapi.dev/api/planets/1/',
  };

  const mockPlanet2: Planet = {
    name: 'Alderaan',
    rotation_period: '24',
    orbital_period: '364',
    diameter: '12500',
    climate: 'temperate',
    gravity: '1 standard',
    terrain: 'grasslands, mountains',
    surface_water: '40',
    population: '2000000000',
    residents: ['https://swapi.dev/api/people/5/'],
    films: ['https://swapi.dev/api/films/1/'],
    created: '2014-12-10T11:35:48.479000Z',
    edited: '2014-12-20T20:58:18.420000Z',
    url: 'https://swapi.dev/api/planets/2/',
  };

  const mockPlanet3: Planet = {
    name: 'Coruscant',
    rotation_period: '24',
    orbital_period: '368',
    diameter: '12240',
    climate: 'temperate',
    gravity: '1 standard',
    terrain: 'cityscape, mountains',
    surface_water: 'unknown',
    population: '1000000000000',
    residents: ['https://swapi.dev/api/people/34/'],
    films: ['https://swapi.dev/api/films/3/'],
    created: '2014-12-10T11:54:13.921000Z',
    edited: '2014-12-20T20:58:18.432000Z',
    url: 'https://swapi.dev/api/planets/9/',
  };

  const mockApiResponse: ApiResponse<Planet> = {
    count: 3,
    next: null,
    previous: null,
    results: [mockPlanet, mockPlanet2, mockPlanet3],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getById', () => {
    it('should fetch a planet by ID', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ data: mockPlanet });

      const result = await planetsApi.getById('1');

      expect(apiClient.get).toHaveBeenCalledWith('/planets/1/');
      expect(result).toEqual(mockPlanet);
    });

    it('should throw an error when the request fails', async () => {
      const error = new Error('Network error');
      vi.mocked(apiClient.get).mockRejectedValue(error);

      await expect(planetsApi.getById('1')).rejects.toThrow('Network error');
    });
  });

  describe('getAll', () => {
    it('should fetch the list of planets', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ data: mockApiResponse });

      const result = await planetsApi.getAll();

      expect(apiClient.get).toHaveBeenCalledWith('/planets/', {
        params: undefined,
      });
      expect(result).toEqual(mockApiResponse);
    });

    it('should include the page parameter', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ data: mockApiResponse });

      await planetsApi.getAll({ page: 2 });

      expect(apiClient.get).toHaveBeenCalledWith('/planets/', {
        params: { page: 2 },
      });
    });

    it('should include the search parameter', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ data: mockApiResponse });

      await planetsApi.getAll({ search: 'Tatooine' });

      expect(apiClient.get).toHaveBeenCalledWith('/planets/', {
        params: { search: 'Tatooine' },
      });
    });

    it('should include multiple parameters', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ data: mockApiResponse });

      await planetsApi.getAll({ page: 2, search: 'Hoth' });

      expect(apiClient.get).toHaveBeenCalledWith('/planets/', {
        params: { page: 2, search: 'Hoth' },
      });
    });

    it('should throw an error when the request fails', async () => {
      const error = new Error('Network error');
      vi.mocked(apiClient.get).mockRejectedValue(error);

      await expect(planetsApi.getAll()).rejects.toThrow('Network error');
    });
  });

  describe('Exported functions', () => {
    describe('getPlanet', () => {
      it('should call planetsApi.getById or planetsServerApi.getById when available', async () => {
        vi.mocked(apiClient.get).mockResolvedValue({ data: mockPlanet });

        const result = await getPlanet('1');

        expect(result).toEqual(mockPlanet);
      });
    });

    describe('getPlanets', () => {
      it('should fetch planets with the default page', async () => {
        vi.mocked(apiClient.get).mockResolvedValue({ data: mockApiResponse });

        const result = await getPlanets();

        expect(result).toEqual(mockApiResponse);
      });

      it('should accept custom page number', async () => {
        const result = await getPlanets(2);

        expect(result).toEqual(mockApiResponse);
      });

      it('should accept search term', async () => {
        const emptyResponse: ApiResponse<Planet> = {
          count: 0,
          next: null,
          previous: null,
          results: [],
        };

        const result = await getPlanets(1, 'Hoth');

        expect(result).toEqual(emptyResponse);
      });
    });
  });
});
