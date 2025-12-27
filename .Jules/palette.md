## 2025-12-07 - Styles Object Pattern
**Learning:** The application uses a large `styles` object for CSS-in-JS within `DrSnugglesControlCenter.tsx` instead of external CSS files or styled-components.
**Action:** When adding new UI elements to this component, continue adding to the `styles` object to maintain consistency, rather than introducing new styling paradigms.

## 2025-10-27 - Modal Consistency & Dev Environment
**Learning:** Native `window.confirm` dialogs break the immersive dark-mode experience and are not accessible. Also, stale `.js` build artifacts alongside `.tsx` files can silently block HMR updates in this Vite setup.
**Action:** Use the custom `InputModal` for all confirmations. Always ensure no stale `.js` files exist in source folders when working with TypeScript.
