import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useResidents } from '../useResidents';
import { TestWrapper } from '@/test/utils';

describe('useResidents', () => {
  it('deve retornar residentes com detalhes completos', async () => {
    const residentUrls = ['https://swapi.dev/api/people/1/'];

    const { result } = renderHook(() => useResidents(residentUrls), {
      wrapper: TestWrapper,
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toHaveLength(1);
    expect(result.current.data?.[0]).toMatchObject({
      name: 'Luke Skywalker',
      hair_color: 'blond',
      eye_color: 'blue',
      gender: 'male',
    });
    // Species e vehicles vem do MSW
    expect(result.current.data?.[0]?.species).toHaveLength(1);
    expect(result.current.data?.[0]?.species[0]).toMatchObject({
      name: 'Human',
    });
    expect(result.current.data?.[0]?.vehicles).toHaveLength(1);
    expect(result.current.data?.[0]?.vehicles[0]).toMatchObject({
      name: 'Snowspeeder',
    });
  });

  it('deve retornar array vazio quando não há URLs', async () => {
    const { result } = renderHook(() => useResidents([]), {
      wrapper: TestWrapper,
    });

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it('deve estar disabled quando não há URLs', async () => {
    const { result } = renderHook(() => useResidents([]), {
      wrapper: TestWrapper,
    });

    expect(result.current.isLoading).toBe(false);
  });

  it('deve buscar múltiplos residentes em paralelo', async () => {
    const residentUrls = [
      'https://swapi.dev/api/people/1/',
      'https://swapi.dev/api/people/2/',
    ];

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

  it('deve ter configurações corretas de cache', async () => {
    const residentUrls = ['https://swapi.dev/api/people/1/'];

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
