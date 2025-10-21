import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useUrlSync } from '../useUrlSync';

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  usePathname: vi.fn(),
  useSearchParams: vi.fn(),
}));

describe('useUrlSync', () => {
  const mockReplace = vi.fn();
  const mockPathname = '/planets';
  const mockSearchParams = new URLSearchParams();

  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams.toString = vi.fn().mockReturnValue('');
    (useRouter as ReturnType<typeof vi.fn>).mockReturnValue({
      replace: mockReplace,
    });
    (usePathname as ReturnType<typeof vi.fn>).mockReturnValue(mockPathname);
    (useSearchParams as ReturnType<typeof vi.fn>).mockReturnValue(
      mockSearchParams
    );
  });

  it('should sync page and search to URL', () => {
    renderHook(() =>
      useUrlSync({
        page: 2,
        search: 'tatooine',
        defaultPage: 1,
      })
    );

    expect(mockReplace).toHaveBeenCalledWith(
      '/planets?page=2&search=tatooine',
      {
        scroll: false,
      }
    );
  });

  it('should omit page parameter when it equals defaultPage', () => {
    renderHook(() =>
      useUrlSync({
        page: 1,
        search: 'hoth',
        defaultPage: 1,
      })
    );

    expect(mockReplace).toHaveBeenCalledWith('/planets?search=hoth', {
      scroll: false,
    });
  });

  it('should omit search parameter when it is empty', () => {
    renderHook(() =>
      useUrlSync({
        page: 3,
        search: '',
        defaultPage: 1,
      })
    );

    expect(mockReplace).toHaveBeenCalledWith('/planets?page=3', {
      scroll: false,
    });
  });

  it('should trim search value before syncing', () => {
    renderHook(() =>
      useUrlSync({
        page: 1,
        search: '  alderaan  ',
        defaultPage: 1,
      })
    );

    expect(mockReplace).toHaveBeenCalledWith('/planets?search=alderaan', {
      scroll: false,
    });
  });

  it('should not update URL if params have not changed', () => {
    // Mock searchParams that already has the same values
    const existingParams = new URLSearchParams('page=2&search=naboo');
    (useSearchParams as ReturnType<typeof vi.fn>).mockReturnValue(
      existingParams
    );

    renderHook(() =>
      useUrlSync({
        page: 2,
        search: 'naboo',
        defaultPage: 1,
      })
    );

    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('should clear all params when page is default and search is empty', () => {
    // Mock searchParams that has some existing params to clear
    const existingParams = new URLSearchParams('page=1&search=test');
    (useSearchParams as ReturnType<typeof vi.fn>).mockReturnValue(
      existingParams
    );

    renderHook(() =>
      useUrlSync({
        page: 1,
        search: '',
        defaultPage: 1,
      })
    );

    expect(mockReplace).toHaveBeenCalledWith('/planets', {
      scroll: false,
    });
  });
});
