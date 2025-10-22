import { describe, it, expect } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useDebounce } from '../useDebounce';

describe('useDebounce', () => {
  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  it('should debounce string value changes', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      }
    );

    expect(result.current).toBe('initial');

    rerender({ value: 'first', delay: 500 });
    rerender({ value: 'second', delay: 500 });
    rerender({ value: 'final', delay: 500 });

    expect(result.current).toBe('initial');

    await waitFor(
      () => {
        expect(result.current).toBe('final');
      },
      { timeout: 600 }
    );
  });

  it('should handle number values', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      {
        initialProps: { value: 0 },
      }
    );

    expect(result.current).toBe(0);

    rerender({ value: 100 });

    await waitFor(
      () => {
        expect(result.current).toBe(100);
      },
      { timeout: 400 }
    );
  });

  it('should handle boolean values', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 200),
      {
        initialProps: { value: false },
      }
    );

    expect(result.current).toBe(false);

    rerender({ value: true });

    await waitFor(
      () => {
        expect(result.current).toBe(true);
      },
      { timeout: 300 }
    );
  });

  it('should respect custom delay', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'start', delay: 100 },
      }
    );

    expect(result.current).toBe('start');

    rerender({ value: 'end', delay: 100 });

    expect(result.current).toBe('start');

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 150));
    });

    expect(result.current).toBe('end');
  });

  it('should use default delay of 500ms', async () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value), {
      initialProps: { value: 'start' },
    });

    rerender({ value: 'end' });

    expect(result.current).toBe('start');

    await waitFor(
      () => {
        expect(result.current).toBe('end');
      },
      { timeout: 600 }
    );
  });

  it('should handle object values', async () => {
    const initialObj = { name: 'John', age: 30 };
    const updatedObj = { name: 'Jane', age: 25 };

    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 200),
      {
        initialProps: { value: initialObj },
      }
    );

    expect(result.current).toBe(initialObj);

    rerender({ value: updatedObj });

    await waitFor(
      () => {
        expect(result.current).toBe(updatedObj);
      },
      { timeout: 300 }
    );
  });

  it('should cancel previous timeout on new value', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      {
        initialProps: { value: 'first' },
      }
    );

    rerender({ value: 'second' });

    await new Promise((resolve) => setTimeout(resolve, 150));

    rerender({ value: 'third' });

    await waitFor(
      () => {
        expect(result.current).toBe('third');
      },
      { timeout: 400 }
    );
  });
});
