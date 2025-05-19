# PhilosiQ Analytics Setup

This document provides information about the analytics setup in the PhilosiQ application.

## Vercel Analytics

PhilosiQ uses [Vercel Analytics](https://vercel.com/analytics) to track user interactions and page views. This helps us understand how users are interacting with the application and identify areas for improvement.

### Implementation

Vercel Analytics is implemented in the following ways:

1. **Basic Page Views**: The `<Analytics />` component is included in `_app.jsx` to automatically track page views.

2. **Custom Events**: We track various custom events throughout the application to gather more detailed usage data.

### Custom Events

The following custom events are tracked:

#### Contact Form

- `contact_form_submitted`: When a user successfully submits the contact form
- `contact_form_error`: When there's an error submitting the contact form

#### Quiz

- `quiz_started`: When a user starts a quiz (short or full)
- `quiz_completed`: When a user completes a quiz
- `results_viewed`: When a user views their quiz results
- `pdf_download_started`: When a user starts downloading their results as PDF
- `pdf_download_completed`: When a PDF download completes successfully
- `pdf_download_error`: When there's an error generating a PDF

#### MindMap

- `mindmap_contribution_started`: When a user starts contributing to the MindMap
- `mindmap_contribution_completed`: When a user successfully contributes to the MindMap
- `mindmap_contribution_error`: When there's an error contributing to the MindMap

### Analytics Utility

We've created a centralized analytics utility (`src/utils/analytics.js`) that provides helper functions for tracking events:

```javascript
import {
  trackEvent,
  trackPageView,
  trackInteraction,
} from "../utils/analytics";

// Track a custom event
trackEvent("custom_event", { property: "value" });

// Track a page view with context
trackPageView("Home", { referrer: "external" });

// Track a user interaction
trackInteraction("click", "signup_button", { location: "header" });
```

## Viewing Analytics Data

Analytics data can be viewed in the [Vercel Dashboard](https://vercel.com/dashboard) under the Analytics tab for the PhilosiQ project.

## Privacy Considerations

Vercel Analytics is privacy-friendly and complies with GDPR and other privacy regulations:

- It doesn't use cookies
- It doesn't track users across sites
- It doesn't store personal identifiable information (PII)

For more information, see the [Vercel Analytics documentation](https://vercel.com/docs/analytics).

## Adding New Tracking

When adding new features to the application, consider adding appropriate analytics tracking to help understand usage patterns. Use the utility functions in `src/utils/analytics.js` for consistency.
