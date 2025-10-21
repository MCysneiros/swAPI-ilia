import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';

const {
  mockUseQueryParams,
  mockUseDebounce,
  mockUseUrlSync,
  mockUsePlanetsQuery,
} = vi.hoisted(() => {
  return {
    mockUseQueryParams: vi.fn(),
    mockUseDebounce: vi.fn(),
    mockUseUrlSync: vi.fn(),
    mockUsePlanetsQuery: vi.fn(),
  };
});

vi.mock('@/constants', () => ({
  PAGINATION: {
    defaultPage: 1,
  },
}));

vi.mock('@/hooks', () => ({
  useQueryParams: mockUseQueryParams,
  useDebounce: mockUseDebounce,
  useUrlSync: mockUseUrlSync,
}));

vi.mock('@/features/planets/hooks/usePlanetsQuery', () => ({
  usePlanetsQuery: mockUsePlanetsQuery,
}));

const DEFAULT_PAGE = 1;

import { useHomePlanets } from '../useHomePlanets';

describe('useHomePlanets', () => {
  const setCurrentPage = vi.fn();
  const setSearch = vi.fn();
  const refetch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    mockUseQueryParams.mockReturnValue({
      currentPage: 2,
      search: 'tat',
      setCurrentPage,
      setSearch,
    });

    mockUseDebounce.mockReturnValue('tatooine');

    mockUsePlanetsQuery.mockReturnValue({
      planets: [{ name: 'Tatooine', url: 'https://swapi.dev/api/planets/1/' }],
      totalCount: 60,
      totalPages: 6,
      hasNextPage: true,
      hasPreviousPage: true,
      showSkeleton: false,
      showErrorState: false,
      showEmptyState: false,
      isSyncing: false,
      refetch,
    });
  });

  it('wires dependencies with debounced search', () => {
    const { result } = renderHook(() => useHomePlanets());

    expect(mockUsePlanetsQuery).toHaveBeenCalledWith({
      page: 2,
      search: 'tatooine',
    });

    expect(mockUseUrlSync).toHaveBeenCalledWith({
      page: 2,
      search: 'tatooine',
      defaultPage: DEFAULT_PAGE,
    });

    expect(result.current.search).toBe('tat');
    expect(result.current.debouncedSearch).toBe('tatooine');
    expect(result.current.currentPage).toBe(2);
    expect(result.current.planets).toHaveLength(1);
    expect(result.current.totalCount).toBe(60);
  });

  it('resets page when search changes', () => {
    const { result } = renderHook(() => useHomePlanets());

    act(() => {
      result.current.onSearchChange('alderaan');
    });

    expect(setSearch).toHaveBeenCalledWith('alderaan');
    expect(setCurrentPage).toHaveBeenCalledWith(DEFAULT_PAGE);
  });

  it('clears search and resets pagination', () => {
    const { result } = renderHook(() => useHomePlanets());

    act(() => {
      result.current.onClearSearch();
    });

    expect(setSearch).toHaveBeenCalledWith('');
    expect(setCurrentPage).toHaveBeenCalledWith(DEFAULT_PAGE);
  });

  it('forwards page changes', () => {
    const { result } = renderHook(() => useHomePlanets());

    act(() => {
      result.current.onPageChange(5);
    });

    expect(setCurrentPage).toHaveBeenCalledWith(5);
  });
});
