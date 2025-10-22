import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSearchParams } from 'next/navigation';
import { useQueryParams } from '../useQueryParams';

vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn(),
}));

describe('useQueryParams', () => {
  const createMockSearchParams = (params: Record<string, string> = {}) => {
    const searchParams = new URLSearchParams(params);
    return {
      get: (key: string) => searchParams.get(key),
      toString: () => searchParams.toString(),
    };
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with default values when no params are present', () => {
    (useSearchParams as ReturnType<typeof vi.fn>).mockReturnValue(
      createMockSearchParams()
    );

    const { result } = renderHook(() => useQueryParams(1));

    expect(result.current.currentPage).toBe(1);
    expect(result.current.search).toBe('');
  });

  it('should initialize with values from URL params', () => {
    (useSearchParams as ReturnType<typeof vi.fn>).mockReturnValue(
      createMockSearchParams({ page: '3', search: 'tatooine' })
    );

    const { result } = renderHook(() => useQueryParams(1));

    expect(result.current.currentPage).toBe(3);
    expect(result.current.search).toBe('tatooine');
  });

  it('should use default page when page param is invalid', () => {
    (useSearchParams as ReturnType<typeof vi.fn>).mockReturnValue(
      createMockSearchParams({ page: 'invalid' })
    );

    const { result } = renderHook(() => useQueryParams(1));

    expect(result.current.currentPage).toBe(1);
  });

  it('should use default page when page param is zero or negative', () => {
    (useSearchParams as ReturnType<typeof vi.fn>).mockReturnValue(
      createMockSearchParams({ page: '0' })
    );

    const { result } = renderHook(() => useQueryParams(1));

    expect(result.current.currentPage).toBe(1);
  });

  it('should allow setting current page', () => {
    (useSearchParams as ReturnType<typeof vi.fn>).mockReturnValue(
      createMockSearchParams()
    );

    const { result } = renderHook(() => useQueryParams(1));

    act(() => {
      result.current.setCurrentPage(5);
    });

    expect(result.current.currentPage).toBe(5);
  });

  it('should allow setting search', () => {
    (useSearchParams as ReturnType<typeof vi.fn>).mockReturnValue(
      createMockSearchParams()
    );

    const { result } = renderHook(() => useQueryParams(1));

    act(() => {
      result.current.setSearch('hoth');
    });

    expect(result.current.search).toBe('hoth');
  });

  it('should update state when searchParams change', () => {
    const mockSearchParams1 = createMockSearchParams({ page: '1', search: '' });
    (useSearchParams as ReturnType<typeof vi.fn>).mockReturnValue(
      mockSearchParams1
    );

    const { result, rerender } = renderHook(() => useQueryParams(1));

    expect(result.current.currentPage).toBe(1);
    expect(result.current.search).toBe('');

    const mockSearchParams2 = createMockSearchParams({
      page: '2',
      search: 'naboo',
    });
    (useSearchParams as ReturnType<typeof vi.fn>).mockReturnValue(
      mockSearchParams2
    );

    rerender();

    expect(result.current.currentPage).toBe(2);
    expect(result.current.search).toBe('naboo');
  });

  it('should respect custom default page', () => {
    (useSearchParams as ReturnType<typeof vi.fn>).mockReturnValue(
      createMockSearchParams()
    );

    const { result } = renderHook(() => useQueryParams(5));

    expect(result.current.currentPage).toBe(5);
  });

  it('should not update state if params have not changed', () => {
    (useSearchParams as ReturnType<typeof vi.fn>).mockReturnValue(
      createMockSearchParams({ page: '2', search: 'endor' })
    );

    const { result, rerender } = renderHook(() => useQueryParams(1));

    const initialPage = result.current.currentPage;
    const initialSearch = result.current.search;

    rerender();

    expect(result.current.currentPage).toBe(initialPage);
    expect(result.current.search).toBe(initialSearch);
  });
});
