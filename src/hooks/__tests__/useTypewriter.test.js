import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useTypewriter } from '../useTypewriter';

describe('useTypewriter Hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('initializes with an empty string', () => {
    const { result } = renderHook(() => useTypewriter(['Hello', 'World']));
    expect(result.current).toBe('');
  });

  it('types out the first word over time', () => {
    const { result } = renderHook(() => useTypewriter(['Hi'], 100)); // 100ms per char

    // Fast-forward time to type "H"
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe('H');

    // Fast-forward to type "i"
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe('Hi');
  });
});
