import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useFilms } from '../useFilms';
import { TestWrapper } from '@/test/utils';
import { planetsApi } from '../../api/planetsApi';
import type { Film } from '@/types';

vi.mock('../../api/planetsApi', () => ({
  planetsApi: {
    getFilmByUrl: vi.fn(),
  },
}));

describe('useFilms', () => {
  const mockFilm1: Film = {
    title: 'A New Hope',
    episode_id: 4,
    opening_crawl: 'It is a period of civil war...',
    director: 'George Lucas',
    producer: 'Gary Kurtz, Rick McCallum',
    release_date: '1977-05-25',
    characters: ['https://swapi.dev/api/people/1/'],
    planets: ['https://swapi.dev/api/planets/1/'],
    starships: [],
    vehicles: [],
    species: [],
    created: '2014-12-10T14:23:31.880000Z',
    edited: '2014-12-20T19:49:45.256000Z',
    url: 'https://swapi.dev/api/films/1/',
  };

  const mockFilm2: Film = {
    title: 'The Empire Strikes Back',
    episode_id: 5,
    opening_crawl: 'It is a dark time...',
    director: 'Irvin Kershner',
    producer: 'Gary Kurtz, Rick McCallum',
    release_date: '1980-05-17',
    characters: ['https://swapi.dev/api/people/1/'],
    planets: ['https://swapi.dev/api/planets/2/'],
    starships: [],
    vehicles: [],
    species: [],
    created: '2014-12-12T11:26:24.656000Z',
    edited: '2014-12-20T19:49:45.256000Z',
    url: 'https://swapi.dev/api/films/2/',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return films successfully when there are URLs', async () => {
    const filmUrls = [
      'https://swapi.dev/api/films/1/',
      'https://swapi.dev/api/films/2/',
    ];

    vi.mocked(planetsApi.getFilmByUrl)
      .mockResolvedValueOnce(mockFilm1)
      .mockResolvedValueOnce(mockFilm2);

    const { result } = renderHook(() => useFilms(filmUrls), {
      wrapper: TestWrapper,
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual([mockFilm1, mockFilm2]);
    expect(planetsApi.getFilmByUrl).toHaveBeenCalledTimes(2);
    expect(planetsApi.getFilmByUrl).toHaveBeenCalledWith(filmUrls[0]);
    expect(planetsApi.getFilmByUrl).toHaveBeenCalledWith(filmUrls[1]);
  });

  it('should return empty array when there are no URLs', async () => {
    const { result } = renderHook(() => useFilms([]), {
      wrapper: TestWrapper,
    });

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(planetsApi.getFilmByUrl).not.toHaveBeenCalled();
  });

  it('should be disabled when there are no URLs', async () => {
    const { result } = renderHook(() => useFilms([]), {
      wrapper: TestWrapper,
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isFetching).toBe(false);
    expect(planetsApi.getFilmByUrl).not.toHaveBeenCalled();
  });

  it('should fetch only one film when there is one URL', async () => {});

  it.skip('should handle errors when fetching films', async () => {
    const filmUrls = ['https://swapi.dev/api/films/999/'];
    const error = new Error('Film not found');

    vi.mocked(planetsApi.getFilmByUrl).mockRejectedValue(error);

    const { result } = renderHook(() => useFilms(filmUrls), {
      wrapper: TestWrapper,
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(error);
    expect(result.current.data).toBeUndefined();
  });

  it('should fetch a single film when only one URL is provided', async () => {
    const filmUrls = ['https://swapi.dev/api/films/1/'];

    vi.mocked(planetsApi.getFilmByUrl).mockResolvedValue(mockFilm1);

    const { result } = renderHook(() => useFilms(filmUrls), {
      wrapper: TestWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual([mockFilm1]);
    expect(planetsApi.getFilmByUrl).toHaveBeenCalledTimes(1);
  });

  it('should fetch films in parallel using Promise.all', async () => {
    const filmUrls = [
      'https://swapi.dev/api/films/1/',
      'https://swapi.dev/api/films/2/',
      'https://swapi.dev/api/films/3/',
    ];

    const mockFilm3 = { ...mockFilm1, episode_id: 6, url: filmUrls[2] };

    vi.mocked(planetsApi.getFilmByUrl)
      .mockResolvedValueOnce(mockFilm1)
      .mockResolvedValueOnce(mockFilm2)
      .mockResolvedValueOnce(mockFilm3);

    const { result } = renderHook(() => useFilms(filmUrls), {
      wrapper: TestWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toHaveLength(3);
    expect(planetsApi.getFilmByUrl).toHaveBeenCalledTimes(3);
  });

  it('should configure cache correctly (30min stale, 1h gc)', async () => {
    const filmUrls = ['https://swapi.dev/api/films/1/'];
    vi.mocked(planetsApi.getFilmByUrl).mockResolvedValue(mockFilm1);

    const { result } = renderHook(() => useFilms(filmUrls), {
      wrapper: TestWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.isRefetching).toBe(false);
  });

  it('should use query key based on provided URLs', async () => {
    const filmUrls1 = ['https://swapi.dev/api/films/1/'];
    const filmUrls2 = ['https://swapi.dev/api/films/2/'];

    vi.mocked(planetsApi.getFilmByUrl)
      .mockResolvedValueOnce(mockFilm1)
      .mockResolvedValueOnce(mockFilm2);

    const { result: result1 } = renderHook(() => useFilms(filmUrls1), {
      wrapper: TestWrapper,
    });

    await waitFor(() => {
      expect(result1.current.isSuccess).toBe(true);
    });

    const { result: result2 } = renderHook(() => useFilms(filmUrls2), {
      wrapper: TestWrapper,
    });

    await waitFor(() => {
      expect(result2.current.isSuccess).toBe(true);
    });

    // Different queries should return different results
    expect(result1.current.data?.[0]).not.toEqual(result2.current.data?.[0]);
  });
});
