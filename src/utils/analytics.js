import { track as vercelTrack } from "@vercel/analytics";

/**
 * Track a user event with Vercel Analytics
 * @param {string} eventName - Name of the event to track
 * @param {object} properties - Properties to include with the event
 */
export function trackEvent(eventName, properties = {}) {
  try {
    vercelTrack(eventName, properties);
    console.debug(`Analytics event tracked: ${eventName}`, properties);
  } catch (error) {
    console.error(`Error tracking analytics event ${eventName}:`, error);
  }
}

/**
 * Track page views with additional context
 * @param {string} pageName - Name of the page being viewed
 * @param {object} properties - Additional properties to track
 */
export function trackPageView(pageName, properties = {}) {
  trackEvent("page_view", {
    page: pageName,
    ...properties,
  });
}

/**
 * Track user interactions with UI elements
 * @param {string} actionType - Type of interaction (click, hover, etc)
 * @param {string} elementName - Name of the element interacted with
 * @param {object} properties - Additional properties to track
 */
export function trackInteraction(actionType, elementName, properties = {}) {
  trackEvent("user_interaction", {
    action: actionType,
    element: elementName,
    ...properties,
  });
}

/**
 * Track errors that occur in the application
 * @param {string} errorType - Type or category of error
 * @param {string} errorMessage - Error message
 * @param {object} properties - Additional properties to track
 */
export function trackError(errorType, errorMessage, properties = {}) {
  trackEvent("error", {
    type: errorType,
    message: errorMessage,
    ...properties,
  });
}

/**
 * Track feature usage
 * @param {string} featureName - Name of the feature being used
 * @param {object} properties - Additional properties to track
 */
export function trackFeatureUsage(featureName, properties = {}) {
  trackEvent("feature_used", {
    feature: featureName,
    ...properties,
  });
}

// Export the original track function as well
export const track = vercelTrack;
