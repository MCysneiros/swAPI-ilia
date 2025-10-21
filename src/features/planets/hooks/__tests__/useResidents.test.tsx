import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useResidents } from '../useResidents';
import { TestWrapper } from '@/test/utils';
import { planetsApi } from '../../api/planetsApi';
import type { Resident } from '@/types';

// Mock global fetch
global.fetch = vi.fn();

vi.mock('../../api/planetsApi', () => ({
  planetsApi: {
    getResidentByUrl: vi.fn(),
  },
}));

describe('useResidents', () => {
  const mockResident: Resident = {
    name: 'Luke Skywalker',
    height: '172',
    mass: '77',
    hair_color: 'blond',
    skin_color: 'fair',
    eye_color: 'blue',
    birth_year: '19BBY',
    gender: 'male',
    homeworld: 'https://swapi.dev/api/planets/1/',
    films: ['https://swapi.dev/api/films/1/'],
    species: ['https://swapi.dev/api/species/1/'],
    vehicles: ['https://swapi.dev/api/vehicles/14/'],
    starships: [],
    created: '2014-12-09T13:50:51.644000Z',
    edited: '2014-12-20T21:17:56.891000Z',
    url: 'https://swapi.dev/api/people/1/',
  };

  const mockSpecies = { name: 'Human' };
  const mockVehicle = { name: 'Snowspeeder', model: 't-47 airspeeder' };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve retornar residentes com detalhes completos', async () => {
    const residentUrls = ['https://swapi.dev/api/people/1/'];

    vi.mocked(planetsApi.getResidentByUrl).mockResolvedValue(mockResident);
    vi.mocked(global.fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockSpecies,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockVehicle,
      } as Response);

    const { result } = renderHook(() => useResidents(residentUrls), {
      wrapper: TestWrapper,
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toHaveLength(1);
    expect(result.current.data?.[0]).toEqual({
      name: 'Luke Skywalker',
      hair_color: 'blond',
      eye_color: 'blue',
      gender: 'male',
      species: [mockSpecies],
      vehicles: [mockVehicle],
    });
  });

  it('deve retornar array vazio quando não há URLs', async () => {
    const { result } = renderHook(() => useResidents([]), {
      wrapper: TestWrapper,
    });

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(planetsApi.getResidentByUrl).not.toHaveBeenCalled();
  });

  it('deve estar disabled quando não há URLs', async () => {
    const { result } = renderHook(() => useResidents([]), {
      wrapper: TestWrapper,
    });

    expect(result.current.isLoading).toBe(false);
    expect(planetsApi.getResidentByUrl).not.toHaveBeenCalled();
  });

  it('deve lidar com erros ao buscar residentes', async () => {
    const residentUrls = ['https://swapi.dev/api/people/999/'];
    const error = new Error('Resident not found');

    vi.mocked(planetsApi.getResidentByUrl).mockRejectedValue(error);

    const { result } = renderHook(() => useResidents(residentUrls), {
      wrapper: TestWrapper,
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(error);
  });

  it('deve buscar múltiplos residentes em paralelo', async () => {
    const residentUrls = [
      'https://swapi.dev/api/people/1/',
      'https://swapi.dev/api/people/2/',
    ];

    const mockResident2 = {
      ...mockResident,
      name: 'C-3PO',
      species: [],
      vehicles: [],
    };

    vi.mocked(planetsApi.getResidentByUrl)
      .mockResolvedValueOnce(mockResident)
      .mockResolvedValueOnce(mockResident2);

    vi.mocked(global.fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockSpecies,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockVehicle,
      } as Response);

    const { result } = renderHook(() => useResidents(residentUrls), {
      wrapper: TestWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toHaveLength(2);
    expect(result.current.data?.[0]?.name).toBe('Luke Skywalker');
    expect(result.current.data?.[1]?.name).toBe('C-3PO');
  });

  it('deve buscar species e vehicles relacionados', async () => {
    const residentUrls = ['https://swapi.dev/api/people/1/'];

    const residentWithMultiple = {
      ...mockResident,
      species: [
        'https://swapi.dev/api/species/1/',
        'https://swapi.dev/api/species/2/',
      ],
      vehicles: [
        'https://swapi.dev/api/vehicles/14/',
        'https://swapi.dev/api/vehicles/30/',
      ],
    };

    vi.mocked(planetsApi.getResidentByUrl).mockResolvedValue(
      residentWithMultiple
    );

    const mockSpecies2 = { name: 'Droid' };
    const mockVehicle2 = { name: 'Speeder bike', model: '74-Z' };

    vi.mocked(global.fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockSpecies,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockSpecies2,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockVehicle,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockVehicle2,
      } as Response);

    const { result } = renderHook(() => useResidents(residentUrls), {
      wrapper: TestWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.[0]?.species).toHaveLength(2);
    expect(result.current.data?.[0]?.vehicles).toHaveLength(2);
  });

  it('deve lidar com residente sem species ou vehicles', async () => {
    const residentUrls = ['https://swapi.dev/api/people/1/'];
    const residentWithoutRelations = {
      ...mockResident,
      species: [],
      vehicles: [],
    };

    vi.mocked(planetsApi.getResidentByUrl).mockResolvedValue(
      residentWithoutRelations
    );

    const { result } = renderHook(() => useResidents(residentUrls), {
      wrapper: TestWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.[0]?.species).toEqual([]);
    expect(result.current.data?.[0]?.vehicles).toEqual([]);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('deve lidar com erro ao buscar species', async () => {
    const residentUrls = ['https://swapi.dev/api/people/1/'];

    vi.mocked(planetsApi.getResidentByUrl).mockResolvedValue(mockResident);
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    } as Response);

    const { result } = renderHook(() => useResidents(residentUrls), {
      wrapper: TestWrapper,
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
  });

  it('deve permitir refetch manual', async () => {
    const residentUrls = ['https://swapi.dev/api/people/1/'];

    vi.mocked(planetsApi.getResidentByUrl).mockResolvedValue(mockResident);
    vi.mocked(global.fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockSpecies,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockVehicle,
      } as Response);

    const { result } = renderHook(() => useResidents(residentUrls), {
      wrapper: TestWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    vi.clearAllMocks();

    const updatedResident = { ...mockResident, name: 'Updated Luke' };
    vi.mocked(planetsApi.getResidentByUrl).mockResolvedValue(updatedResident);
    vi.mocked(global.fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockSpecies,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockVehicle,
      } as Response);

    await result.current.refetch();

    await waitFor(() => {
      expect(result.current.data?.[0]?.name).toBe('Updated Luke');
    });
  });

  it('deve ter configurações corretas de cache', async () => {
    const residentUrls = ['https://swapi.dev/api/people/1/'];

    vi.mocked(planetsApi.getResidentByUrl).mockResolvedValue(mockResident);
    vi.mocked(global.fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockSpecies,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockVehicle,
      } as Response);

    const { result } = renderHook(() => useResidents(residentUrls), {
      wrapper: TestWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Não deve refetch automaticamente
    expect(result.current.isRefetching).toBe(false);
  });
});
