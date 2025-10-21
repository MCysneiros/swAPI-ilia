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
      // twMerge deve resolver conflitos e manter apenas px-4
      expect(result).toBe('py-1 px-4');
    });

    it('deve lidar com classes condicionais', () => {
      const result = cn('base-class', false && 'hidden', 'another-class');
      expect(result).toBe('base-class another-class');
    });

    it('deve aceitar arrays', () => {
      const result = cn(['class1', 'class2'], 'class3');
      expect(result).toContain('class1');
      expect(result).toContain('class2');
      expect(result).toContain('class3');
    });

    it('deve retornar string vazia para entrada vazia', () => {
      const result = cn();
      expect(result).toBe('');
    });
  });

  describe('formatDate', () => {
    it('deve formatar data para pt-BR por padrão', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const result = formatDate(date);
      expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });

    it('deve aceitar string ISO como entrada', () => {
      const result = formatDate('2024-01-15T10:30:00Z');
      expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });

    it('deve aceitar locale customizado', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const result = formatDate(date, 'en-US');
      // Formato americano MM/DD/YYYY
      expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });

    it('deve aceitar opções de formato customizadas', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const result = formatDate(date, 'pt-BR', {
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

    it('deve formatar tempo relativo em segundos', () => {
      const now = new Date('2024-01-15T10:30:00Z');
      vi.setSystemTime(now);

      const pastDate = new Date('2024-01-15T10:29:30Z');
      const result = formatRelativeTime(pastDate);
      expect(result).toContain('30');
    });

    it('deve formatar tempo relativo em minutos', () => {
      const now = new Date('2024-01-15T10:30:00Z');
      vi.setSystemTime(now);

      const pastDate = new Date('2024-01-15T10:25:00Z');
      const result = formatRelativeTime(pastDate);
      expect(result).toContain('5');
    });

    it('deve formatar tempo relativo em horas', () => {
      const now = new Date('2024-01-15T10:30:00Z');
      vi.setSystemTime(now);

      const pastDate = new Date('2024-01-15T08:30:00Z');
      const result = formatRelativeTime(pastDate);
      expect(result).toContain('2');
    });

    it('deve formatar tempo relativo em dias', () => {
      const now = new Date('2024-01-15T10:30:00Z');
      vi.setSystemTime(now);

      const pastDate = new Date('2024-01-12T10:30:00Z');
      const result = formatRelativeTime(pastDate);
      expect(result).toContain('3');
    });

    it('deve aceitar string ISO como entrada', () => {
      const now = new Date('2024-01-15T10:30:00Z');
      vi.setSystemTime(now);

      const result = formatRelativeTime('2024-01-15T10:29:00Z');
      expect(result).toBeDefined();
    });
  });

  describe('extractIdFromUrl', () => {
    it('deve extrair ID de URL do SWAPI', () => {
      const url = 'https://swapi.dev/api/planets/1/';
      const result = extractIdFromUrl(url);
      expect(result).toBe('1');
    });

    it('deve extrair IDs de múltiplos dígitos', () => {
      const url = 'https://swapi.dev/api/planets/42/';
      const result = extractIdFromUrl(url);
      expect(result).toBe('42');
    });

    it('deve extrair ID de diferentes recursos', () => {
      const url = 'https://swapi.dev/api/people/123/';
      const result = extractIdFromUrl(url);
      expect(result).toBe('123');
    });

    it('deve retornar string vazia para URL inválida', () => {
      const url = 'https://swapi.dev/api/planets/';
      const result = extractIdFromUrl(url);
      expect(result).toBe('');
    });

    it('deve retornar string vazia para URL sem ID', () => {
      const url = 'https://swapi.dev/api/';
      const result = extractIdFromUrl(url);
      expect(result).toBe('');
    });
  });

  describe('buildUrl', () => {
    it('deve construir URL com parâmetros', () => {
      const result = buildUrl('https://api.example.com/data', {
        page: 1,
        search: 'test',
      });
      expect(result).toContain('page=1');
      expect(result).toContain('search=test');
    });

    it('deve ignorar valores undefined', () => {
      const result = buildUrl('https://api.example.com/data', {
        page: 1,
        search: undefined,
      });
      expect(result).toContain('page=1');
      expect(result).not.toContain('search');
    });

    it('deve ignorar valores null', () => {
      const result = buildUrl('https://api.example.com/data', {
        page: 1,
        filter: null,
      });
      expect(result).toContain('page=1');
      expect(result).not.toContain('filter');
    });

    it('deve ignorar strings vazias', () => {
      const result = buildUrl('https://api.example.com/data', {
        page: 1,
        search: '',
      });
      expect(result).toContain('page=1');
      expect(result).not.toContain('search');
    });

    it('deve converter valores para string', () => {
      const result = buildUrl('https://api.example.com/data', {
        page: 2,
        active: true,
      });
      expect(result).toContain('page=2');
      expect(result).toContain('active=true');
    });

    it('deve lidar com URL base sem barra final', () => {
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

    it('deve ignorar chamadas durante período de throttle', () => {
      const fn = vi.fn();
      const throttledFn = throttle(fn, 1000);

      throttledFn('first');
      throttledFn('second');
      throttledFn('third');

      // Apenas a primeira chamada deve ser executada
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith('first');
    });
  });
});
