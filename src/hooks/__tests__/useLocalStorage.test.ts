import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('initialization', () => {
    it('should return initial value when localStorage is empty', () => {
      const { result } = renderHook(() =>
        useLocalStorage('testKey', 'initialValue')
      );

      expect(result.current[0]).toBe('initialValue');
    });

    it('should return stored value from localStorage', () => {
      localStorage.setItem('testKey', JSON.stringify('storedValue'));

      const { result } = renderHook(() =>
        useLocalStorage('testKey', 'initialValue')
      );

      expect(result.current[0]).toBe('storedValue');
    });

    it('should handle different data types', () => {
      const testCases = [
        { key: 'string', value: 'test' },
        { key: 'number', value: 42 },
        { key: 'boolean', value: true },
        { key: 'object', value: { name: 'John', age: 30 } },
        { key: 'array', value: [1, 2, 3] },
        { key: 'null', value: null },
      ];

      testCases.forEach(({ key, value }) => {
        const { result } = renderHook(() => useLocalStorage(key, value));
        expect(result.current[0]).toEqual(value);
      });
    });
  });

  describe('setValue', () => {
    it('should update value in state and localStorage', () => {
      const { result } = renderHook(() =>
        useLocalStorage('testKey', 'initial')
      );

      act(() => {
        result.current[1]('updated');
      });

      expect(result.current[0]).toBe('updated');
      expect(localStorage.getItem('testKey')).toBe(JSON.stringify('updated'));
    });

    it('should handle function updater', () => {
      const { result } = renderHook(() => useLocalStorage('counter', 0));

      act(() => {
        result.current[1]((prev) => prev + 1);
      });

      expect(result.current[0]).toBe(1);

      act(() => {
        result.current[1]((prev) => prev + 1);
      });

      expect(result.current[0]).toBe(2);
    });

    it('should persist complex objects', () => {
      const complexObject = {
        user: {
          name: 'John',
          preferences: {
            theme: 'dark',
            notifications: true,
          },
        },
        timestamp: Date.now(),
      };

      const { result } = renderHook(() =>
        useLocalStorage('complex', complexObject)
      );

      const updatedObject = {
        ...complexObject,
        user: { ...complexObject.user, name: 'Jane' },
      };

      act(() => {
        result.current[1](updatedObject);
      });

      expect(result.current[0]).toEqual(updatedObject);
      expect(JSON.parse(localStorage.getItem('complex')!)).toEqual(
        updatedObject
      );
    });
  });

  describe('removeValue', () => {
    it('should reset to initial value and remove from localStorage', () => {
      const { result } = renderHook(() =>
        useLocalStorage('testKey', 'initial')
      );

      act(() => {
        result.current[1]('updated');
      });

      expect(result.current[0]).toBe('updated');

      act(() => {
        result.current[2](); // removeValue
      });

      expect(result.current[0]).toBe('initial');
      expect(localStorage.getItem('testKey')).toBeNull();
    });

    it('should handle removing non-existent key', () => {
      const { result } = renderHook(() =>
        useLocalStorage('nonExistent', 'default')
      );

      act(() => {
        result.current[2]();
      });

      expect(result.current[0]).toBe('default');
      expect(localStorage.getItem('nonExistent')).toBeNull();
    });
  });

  describe('error handling', () => {
    it('should handle JSON parse errors gracefully', () => {
      const consoleWarnSpy = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => {});

      localStorage.setItem('corruptedKey', 'invalid json {{{');

      const { result } = renderHook(() =>
        useLocalStorage('corruptedKey', 'fallback')
      );

      expect(result.current[0]).toBe('fallback');
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Error loading localStorage key "corruptedKey":',
        expect.any(SyntaxError)
      );

      consoleWarnSpy.mockRestore();
    });

    describe('storage event synchronization', () => {
      it('should sync state when storage event fires', () => {
        renderHook(() => useLocalStorage('syncKey', 'initial'));

        act(() => {
          localStorage.setItem('syncKey', JSON.stringify('fromAnotherTab'));
        });

        expect(localStorage.getItem('syncKey')).toBe(
          JSON.stringify('fromAnotherTab')
        );
      });

      it('should ignore storage events for different keys', () => {
        const { result } = renderHook(() =>
          useLocalStorage('myKey', 'initial')
        );

        act(() => {
          localStorage.setItem(
            'differentKey',
            JSON.stringify('shouldNotUpdate')
          );
        });

        expect(result.current[0]).toBe('initial');
      });

      it('should handle storage changes gracefully', () => {
        const { result } = renderHook(() =>
          useLocalStorage('testKey', 'initial')
        );

        act(() => {
          localStorage.setItem('testKey', JSON.stringify('updated'));
        });

        expect(result.current[0]).toBe('initial');

        expect(localStorage.getItem('testKey')).toBe(JSON.stringify('updated'));
      });
    });

    describe('SSR compatibility', () => {
      it('should handle server-side rendering (no window)', () => {
        const { result } = renderHook(() =>
          useLocalStorage('test-key', 'default')
        );

        expect(result.current[0]).toBe('default');
      });
    });

    describe('multiple instances', () => {
      it('should keep different keys independent', () => {
        const { result: result1 } = renderHook(() =>
          useLocalStorage('key1', 'value1')
        );
        const { result: result2 } = renderHook(() =>
          useLocalStorage('key2', 'value2')
        );

        expect(result1.current[0]).toBe('value1');
        expect(result2.current[0]).toBe('value2');

        act(() => {
          result1.current[1]('changed1');
        });

        expect(result1.current[0]).toBe('changed1');
        expect(result2.current[0]).toBe('value2');
      });

      it('should sync multiple hooks with same key', async () => {
        const { result: result1 } = renderHook(() =>
          useLocalStorage('shared-key', 'initial')
        );
        renderHook(() => useLocalStorage('shared-key', 'initial'));

        await act(async () => {
          result1.current[1]('updated');
        });

        expect(result1.current[0]).toBe('updated');
        expect(localStorage.getItem('shared-key')).toBe(
          JSON.stringify('updated')
        );
      });
    });
  });
});
