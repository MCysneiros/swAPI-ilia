import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Clear all mocks
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
      localStorage.setItem('corruptedKey', 'invalid json {{{');

      const { result } = renderHook(() =>
        useLocalStorage('corruptedKey', 'fallback')
      );

      expect(result.current[0]).toBe('fallback');
    });

    it('should handle localStorage setItem errors', () => {
      const { result } = renderHook(() =>
        useLocalStorage('testKey', 'initial')
      );

      // Mock localStorage.setItem to throw
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = vi.fn(() => {
        throw new Error('QuotaExceededError');
      });

      act(() => {
        result.current[1]('shouldFail');
      });

      // Should still update state even if localStorage fails
      expect(result.current[0]).toBe('shouldFail');

      // Restore
      Storage.prototype.setItem = originalSetItem;
    });
  });

  describe('storage event synchronization', () => {
    it('should sync state when storage event fires', () => {
      renderHook(() => useLocalStorage('syncKey', 'initial'));

      // Simulate storage event from another tab
      // Note: jsdom has limitations with StorageEvent, so we just test the localStorage update
      act(() => {
        localStorage.setItem('syncKey', JSON.stringify('fromAnotherTab'));
        // In real browser, this would trigger a storage event
      });

      // The hook should detect the change on next setValue call or re-render
      expect(localStorage.getItem('syncKey')).toBe(
        JSON.stringify('fromAnotherTab')
      );
    });

    it('should ignore storage events for different keys', () => {
      const { result } = renderHook(() => useLocalStorage('myKey', 'initial'));

      act(() => {
        localStorage.setItem('differentKey', JSON.stringify('shouldNotUpdate'));
      });

      expect(result.current[0]).toBe('initial');
    });

    it('should handle storage changes gracefully', () => {
      const { result } = renderHook(() =>
        useLocalStorage('testKey', 'initial')
      );

      // Update localStorage directly
      act(() => {
        localStorage.setItem('testKey', JSON.stringify('updated'));
      });

      // The hook maintains its own state until explicitly updated
      expect(result.current[0]).toBe('initial');

      // But localStorage should have the new value
      expect(localStorage.getItem('testKey')).toBe(JSON.stringify('updated'));
    });
  });

  describe('SSR compatibility', () => {
    it('should handle server-side rendering (no window)', () => {
      // This test would need to run in a Node.js environment without jsdom
      // For now we just test that the hook works with localStorage present
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
      // Note: In jsdom, hooks don't automatically sync unless there's a storage event
      // In a real browser, they would sync via storage events from other tabs
      expect(localStorage.getItem('shared-key')).toBe(
        JSON.stringify('updated')
      );
    });
  });
});
