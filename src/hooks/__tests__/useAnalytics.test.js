import { describe, it, expect, vi } from 'vitest';
import { logUserInteraction } from '../useAnalytics';
import { logEvent } from 'firebase/analytics';

// Mock Firebase
vi.mock('firebase/analytics', () => ({
  logEvent: vi.fn(),
  getAnalytics: vi.fn(() => ({})), // Return dummy object
}));

vi.mock('../../lib/firebase', () => ({
  analytics: {}, // Truthy object to simulate initialized analytics
  app: {},
}));

describe('useAnalytics (logUserInteraction)', () => {
  it('calls firebase logEvent with correct parameters', () => {
    const eventName = 'test_event';
    const params = { foo: 'bar' };
    
    logUserInteraction(eventName, params);

    expect(logEvent).toHaveBeenCalledWith({}, eventName, params);
  });
});
