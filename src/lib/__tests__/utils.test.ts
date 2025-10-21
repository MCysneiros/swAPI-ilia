import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  cn,
  formatDate,
  formatRelativeTime,
  extractIdFromUrl,
  buildUrl,
  debounce,
  throttle,
} from '../utils';

describe('utils', () => {
  describe('cn', () => {
    it('deve mesclar classes do Tailwind', () => {
      const result = cn('px-2 py-1', 'px-4');
      // twMerge should resolve conflicts and keep only px-4
      expect(result).toBe('py-1 px-4');
    });

    it('should handle conditional classes', () => {
      const result = cn('base-class', false && 'hidden', 'another-class');
      expect(result).toBe('base-class another-class');
    });

    it('should accept arrays', () => {
      const result = cn(['class1', 'class2'], 'class3');
      expect(result).toContain('class1');
      expect(result).toContain('class2');
      expect(result).toContain('class3');
    });

    it('should return empty string for empty input', () => {
      const result = cn();
      expect(result).toBe('');
    });
  });

  describe('formatDate', () => {
    it('should format date to en-US by default', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const result = formatDate(date);
      expect(result).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
    });

    it('should accept ISO string as input', () => {
      const result = formatDate('2024-01-15T10:30:00Z');
      expect(result).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
    });

    it('should accept custom locale', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const result = formatDate(date, 'pt-BR');
      // Brazilian format DD/MM/YYYY
      expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });

    it('should accept custom format options', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const result = formatDate(date, 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      expect(result).toContain('2024');
    });
  });

  describe('formatRelativeTime', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should format relative time in seconds', () => {
      const now = new Date('2024-01-15T10:30:00Z');
      vi.setSystemTime(now);

      const pastDate = new Date('2024-01-15T10:29:30Z');
      const result = formatRelativeTime(pastDate);
      expect(result).toContain('30');
    });

    it('should format relative time in minutes', () => {
      const now = new Date('2024-01-15T10:30:00Z');
      vi.setSystemTime(now);

      const pastDate = new Date('2024-01-15T10:25:00Z');
      const result = formatRelativeTime(pastDate);
      expect(result).toContain('5');
    });

    it('should format relative time in hours', () => {
      const now = new Date('2024-01-15T10:30:00Z');
      vi.setSystemTime(now);

      const pastDate = new Date('2024-01-15T08:30:00Z');
      const result = formatRelativeTime(pastDate);
      expect(result).toContain('2');
    });

    it('should format relative time in days', () => {
      const now = new Date('2024-01-15T10:30:00Z');
      vi.setSystemTime(now);

      const pastDate = new Date('2024-01-12T10:30:00Z');
      const result = formatRelativeTime(pastDate);
      expect(result).toContain('3');
    });

    it('should accept ISO string as input', () => {
      const now = new Date('2024-01-15T10:30:00Z');
      vi.setSystemTime(now);

      const result = formatRelativeTime('2024-01-15T10:29:00Z');
      expect(result).toBeDefined();
    });
  });

  describe('extractIdFromUrl', () => {
    it('should extract ID from SWAPI URL', () => {
      const url = 'https://swapi.dev/api/planets/1/';
      const result = extractIdFromUrl(url);
      expect(result).toBe('1');
    });

    it('should extract multi-digit IDs', () => {
      const url = 'https://swapi.dev/api/planets/42/';
      const result = extractIdFromUrl(url);
      expect(result).toBe('42');
    });

    it('should extract ID from different resources', () => {
      const url = 'https://swapi.dev/api/people/123/';
      const result = extractIdFromUrl(url);
      expect(result).toBe('123');
    });

    it('should return empty string for invalid URL', () => {
      const url = 'https://swapi.dev/api/planets/';
      const result = extractIdFromUrl(url);
      expect(result).toBe('');
    });

    it('should return empty string for URL without ID', () => {
      const url = 'https://swapi.dev/api/';
      const result = extractIdFromUrl(url);
      expect(result).toBe('');
    });
  });

  describe('buildUrl', () => {
    it('should build URL with parameters', () => {
      const result = buildUrl('https://api.example.com/data', {
        page: 1,
        search: 'test',
      });
      expect(result).toContain('page=1');
      expect(result).toContain('search=test');
    });

    it('should ignore undefined values', () => {
      const result = buildUrl('https://api.example.com/data', {
        page: 1,
        search: undefined,
      });
      expect(result).toContain('page=1');
      expect(result).not.toContain('search');
    });

    it('should ignore null values', () => {
      const result = buildUrl('https://api.example.com/data', {
        page: 1,
        filter: null,
      });
      expect(result).toContain('page=1');
      expect(result).not.toContain('filter');
    });

    it('should ignore empty strings', () => {
      const result = buildUrl('https://api.example.com/data', {
        page: 1,
        search: '',
      });
      expect(result).toContain('page=1');
      expect(result).not.toContain('search');
    });

    it('should convert values to string', () => {
      const result = buildUrl('https://api.example.com/data', {
        page: 2,
        active: true,
      });
      expect(result).toContain('page=2');
      expect(result).toContain('active=true');
    });

    it('should handle base URL without trailing slash', () => {
      const result = buildUrl('https://api.example.com/data', { page: 1 });
      expect(result).toContain('https://api.example.com/data?page=1');
    });
  });

  describe('debounce', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('deve atrasar execução da função', () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, 500);

      debouncedFn();
      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(500);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('deve cancelar execuções anteriores', () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, 500);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      vi.advanceTimersByTime(500);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('deve passar argumentos corretamente', () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, 500);

      debouncedFn('arg1', 'arg2');
      vi.advanceTimersByTime(500);

      expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
    });

    it('deve resetar timer em cada chamada', () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, 500);

      debouncedFn();
      vi.advanceTimersByTime(300);
      debouncedFn();
      vi.advanceTimersByTime(300);

      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(200);
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('throttle', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('deve limitar execuções da função', () => {
      const fn = vi.fn();
      const throttledFn = throttle(fn, 1000);

      throttledFn();
      throttledFn();
      throttledFn();

      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('deve permitir execução após período de limite', () => {
      const fn = vi.fn();
      const throttledFn = throttle(fn, 1000);

      throttledFn();
      expect(fn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(1000);
      throttledFn();
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('deve passar argumentos corretamente', () => {
      const fn = vi.fn();
      const throttledFn = throttle(fn, 1000);

      throttledFn('arg1', 'arg2');
      expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
    });

    it('should ignore calls during throttle period', () => {
      const fn = vi.fn();
      const throttledFn = throttle(fn, 1000);

      throttledFn('first');
      throttledFn('second');
      throttledFn('third');

      // Only the first call should be executed
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith('first');
    });
  });
});
