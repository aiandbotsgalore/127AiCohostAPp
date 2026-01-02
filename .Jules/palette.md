## 2025-12-07 - Styles Object Pattern
**Learning:** The application uses a large `styles` object for CSS-in-JS within `DrSnugglesControlCenter.tsx` instead of external CSS files or styled-components.
**Action:** When adding new UI elements to this component, continue adding to the `styles` object to maintain consistency, rather than introducing new styling paradigms.

## 2025-10-27 - Modal Consistency & Dev Environment
**Learning:** Native `window.confirm` dialogs break the immersive dark-mode experience and are not accessible. Also, stale `.js` build artifacts alongside `.tsx` files can silently block HMR updates in this Vite setup.
**Action:** Use the custom `InputModal` for all confirmations. Always ensure no stale `.js` files exist in source folders when working with TypeScript.

## 2025-05-15 - Form Control Association
**Learning:** Many form controls (especially `<select>` elements) were visually labeled but lacked programmatic `id`/`htmlFor` association, making them inaccessible to screen readers. Implicit nesting (input inside label) is not consistently used.
**Action:** Always add unique `id`s to form inputs and matching `htmlFor` attributes to their corresponding labels to ensure robust accessibility.

## 2024-05-23 - Immediate Feedback for Async Actions
**Learning:** Users often double-clicked the "Go Live" button because there was no immediate visual feedback during the connection handshake.
**Action:** Added an `isConnecting` state that immediately disables the button and changes text to "CONNECTING..." (or "STOPPING..."). This pattern should be applied to all async triggers in the app.
