import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePagination } from '../usePagination';

describe('usePagination', () => {
  describe('initialization', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => usePagination());

      expect(result.current.currentPage).toBe(1);
      expect(result.current.pageSize).toBe(10);
      expect(result.current.totalPages).toBe(1);
      expect(result.current.hasNextPage).toBe(false);
      expect(result.current.hasPreviousPage).toBe(false);
    });

    it('should initialize with custom values', () => {
      const { result } = renderHook(() =>
        usePagination({
          initialPage: 3,
          pageSize: 20,
          totalItems: 100,
        })
      );

      expect(result.current.currentPage).toBe(3);
      expect(result.current.pageSize).toBe(20);
      expect(result.current.totalPages).toBe(5);
    });

    it('should calculate total pages correctly', () => {
      const { result } = renderHook(() =>
        usePagination({
          pageSize: 10,
          totalItems: 95,
        })
      );

      expect(result.current.totalPages).toBe(10); // ceil(95/10) = 10
    });
  });

  describe('navigation', () => {
    it('should go to next page', () => {
      const { result } = renderHook(() =>
        usePagination({
          totalItems: 100,
        })
      );

      act(() => {
        result.current.nextPage();
      });

      expect(result.current.currentPage).toBe(2);
    });

    it('should go to previous page', () => {
      const { result } = renderHook(() =>
        usePagination({
          initialPage: 3,
          totalItems: 100,
        })
      );

      act(() => {
        result.current.previousPage();
      });

      expect(result.current.currentPage).toBe(2);
    });

    it('should go to specific page', () => {
      const { result } = renderHook(() =>
        usePagination({
          totalItems: 100,
        })
      );

      act(() => {
        result.current.goToPage(5);
      });

      expect(result.current.currentPage).toBe(5);
    });

    it('should go to first page', () => {
      const { result } = renderHook(() =>
        usePagination({
          initialPage: 5,
          totalItems: 100,
        })
      );

      act(() => {
        result.current.goToFirstPage();
      });

      expect(result.current.currentPage).toBe(1);
    });

    it('should go to last page', () => {
      const { result } = renderHook(() =>
        usePagination({
          pageSize: 10,
          totalItems: 100,
        })
      );

      act(() => {
        result.current.goToLastPage();
      });

      expect(result.current.currentPage).toBe(10);
    });
  });

  describe('boundaries', () => {
    it('should not go before first page', () => {
      const { result } = renderHook(() =>
        usePagination({
          initialPage: 1,
          totalItems: 100,
        })
      );

      act(() => {
        result.current.previousPage();
      });

      expect(result.current.currentPage).toBe(1);
    });

    it('should not go beyond last page', () => {
      const { result } = renderHook(() =>
        usePagination({
          initialPage: 10,
          pageSize: 10,
          totalItems: 100,
        })
      );

      act(() => {
        result.current.nextPage();
      });

      expect(result.current.currentPage).toBe(10);
    });

    it('should clamp page number to valid range when using goToPage', () => {
      const { result } = renderHook(() =>
        usePagination({
          pageSize: 10,
          totalItems: 100,
        })
      );

      act(() => {
        result.current.goToPage(999);
      });

      expect(result.current.currentPage).toBe(10);

      act(() => {
        result.current.goToPage(-5);
      });

      expect(result.current.currentPage).toBe(1);
    });

    it('should handle zero total items', () => {
      const { result } = renderHook(() =>
        usePagination({
          totalItems: 0,
        })
      );

      expect(result.current.totalPages).toBe(1);
      expect(result.current.hasNextPage).toBe(false);
    });
  });

  describe('page indicators', () => {
    it('should indicate has next page correctly', () => {
      const { result } = renderHook(() =>
        usePagination({
          initialPage: 5,
          pageSize: 10,
          totalItems: 100,
        })
      );

      expect(result.current.hasNextPage).toBe(true);

      act(() => {
        result.current.goToLastPage();
      });

      expect(result.current.hasNextPage).toBe(false);
    });

    it('should indicate has previous page correctly', () => {
      const { result } = renderHook(() =>
        usePagination({
          initialPage: 1,
          totalItems: 100,
        })
      );

      expect(result.current.hasPreviousPage).toBe(false);

      act(() => {
        result.current.nextPage();
      });

      expect(result.current.hasPreviousPage).toBe(true);
    });
  });

  describe('page size changes', () => {
    it('should change page size', () => {
      const { result } = renderHook(() =>
        usePagination({
          pageSize: 10,
          totalItems: 100,
        })
      );

      act(() => {
        result.current.setPageSize(20);
      });

      expect(result.current.pageSize).toBe(20);
      expect(result.current.totalPages).toBe(5);
    });

    it('should reset to first page when changing page size', () => {
      const { result } = renderHook(() =>
        usePagination({
          initialPage: 5,
          pageSize: 10,
          totalItems: 100,
        })
      );

      act(() => {
        result.current.setPageSize(20);
      });

      expect(result.current.currentPage).toBe(1);
    });

    it('should enforce maximum page size', () => {
      const { result } = renderHook(() =>
        usePagination({
          totalItems: 100,
        })
      );

      act(() => {
        result.current.setPageSize(999);
      });

      expect(result.current.pageSize).toBe(100); // Max page size
    });

    it('should enforce minimum page size', () => {
      const { result } = renderHook(() =>
        usePagination({
          totalItems: 100,
        })
      );

      act(() => {
        result.current.setPageSize(-5);
      });

      expect(result.current.pageSize).toBe(1);
    });
  });

  describe('edge cases', () => {
    it('should handle single page scenario', () => {
      const { result } = renderHook(() =>
        usePagination({
          pageSize: 10,
          totalItems: 5,
        })
      );

      expect(result.current.totalPages).toBe(1);
      expect(result.current.hasNextPage).toBe(false);
      expect(result.current.hasPreviousPage).toBe(false);
    });

    it('should handle exact page division', () => {
      const { result } = renderHook(() =>
        usePagination({
          pageSize: 10,
          totalItems: 100,
        })
      );

      expect(result.current.totalPages).toBe(10);
    });

    it('should handle partial last page', () => {
      const { result } = renderHook(() =>
        usePagination({
          pageSize: 10,
          totalItems: 95,
        })
      );

      expect(result.current.totalPages).toBe(10);
    });
  });
});
