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
    residents: [],
    films: [],
    created: '2014-12-09T13:50:49.641000Z',
    edited: '2014-12-20T20:58:18.411000Z',
    url: 'https://swapi.dev/api/planets/1/',
  };

  const mockApiResponse: ApiResponse<Planet> = {
    count: 1,
    next: null,
    previous: null,
    results: [mockPlanet],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getById', () => {
    it('deve buscar planeta por ID', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ data: mockPlanet });

      const result = await planetsApi.getById('1');

      expect(apiClient.get).toHaveBeenCalledWith('/planets/1/');
      expect(result).toEqual(mockPlanet);
    });

    it('deve lançar erro quando falhar', async () => {
      const error = new Error('Network error');
      vi.mocked(apiClient.get).mockRejectedValue(error);

      await expect(planetsApi.getById('1')).rejects.toThrow('Network error');
    });
  });

  describe('getAll', () => {
    it('deve buscar lista de planetas', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ data: mockApiResponse });

      const result = await planetsApi.getAll();

      expect(apiClient.get).toHaveBeenCalledWith('/planets/', {
        params: undefined,
      });
      expect(result).toEqual(mockApiResponse);
    });

    it('deve incluir parâmetro de página', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ data: mockApiResponse });

      await planetsApi.getAll({ page: 2 });

      expect(apiClient.get).toHaveBeenCalledWith('/planets/', {
        params: { page: 2 },
      });
    });

    it('deve incluir parâmetro de busca', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ data: mockApiResponse });

      await planetsApi.getAll({ search: 'Tatooine' });

      expect(apiClient.get).toHaveBeenCalledWith('/planets/', {
        params: { search: 'Tatooine' },
      });
    });

    it('deve incluir múltiplos parâmetros', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ data: mockApiResponse });

      await planetsApi.getAll({ page: 2, search: 'Hoth' });

      expect(apiClient.get).toHaveBeenCalledWith('/planets/', {
        params: { page: 2, search: 'Hoth' },
      });
    });

    it('deve lançar erro quando falhar', async () => {
      const error = new Error('Network error');
      vi.mocked(apiClient.get).mockRejectedValue(error);

      await expect(planetsApi.getAll()).rejects.toThrow('Network error');
    });
  });

  describe('Exported functions', () => {
    describe('getPlanet', () => {
      it('deve chamar planetsApi.getById ou planetsServerApi.getById conforme disponível', async () => {
        vi.mocked(apiClient.get).mockResolvedValue({ data: mockPlanet });

        const result = await getPlanet('1');

        expect(result).toEqual(mockPlanet);
      });
    });

    describe('getPlanets', () => {
      it('deve buscar planetas com página padrão', async () => {
        vi.mocked(apiClient.get).mockResolvedValue({ data: mockApiResponse });

        const result = await getPlanets();

        expect(result).toEqual(mockApiResponse);
      });

      it('deve aceitar número de página customizado', async () => {
        vi.mocked(apiClient.get).mockResolvedValue({ data: mockApiResponse });

        const result = await getPlanets(2);

        expect(result).toEqual(mockApiResponse);
        expect(apiClient.get).toHaveBeenCalledWith('/planets', {
          params: { page: 2 },
        });
      });

      it('deve aceitar termo de busca', async () => {
        vi.mocked(apiClient.get).mockResolvedValue({ data: mockApiResponse });

        const result = await getPlanets(1, 'Hoth');

        expect(result).toEqual(mockApiResponse);
        expect(apiClient.get).toHaveBeenCalledWith('/planets', {
          params: { page: 1, search: 'Hoth' },
        });
      });
    });
  });
});
