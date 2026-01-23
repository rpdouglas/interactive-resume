import { useEffect } from 'react';
import { logEvent } from "firebase/analytics";
import { analytics } from "../lib/firebase";

/**
 * 📊 useAnalytics Hook
 * Handles page view logging and provides event tracking helper.
 */
export const useAnalytics = () => {
  // Log Page View on Mount
  useEffect(() => {
    if (analytics) {
      logEvent(analytics, 'page_view');
    }
  }, []);

  return;
};

/**
 * 📡 Log User Interaction
 * Safely logs custom events to Firebase Analytics.
 * @param {string} eventName - Snake_case event name (e.g., 'select_skill')
 * @param {object} params - Event parameters
 */
export const logUserInteraction = (eventName, params = {}) => {
  if (analytics) {
    try {
      logEvent(analytics, eventName, params);
      // Optional: Log to console in Dev mode for verification
      if (import.meta.env.DEV) {
        console.log(`📊 [Analytics] ${eventName}:`, params);
      }
    } catch (error) {
      console.warn("Analytics Error:", error);
    }
  }
};
