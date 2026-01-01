## 2025-12-07 - Styles Object Pattern
**Learning:** The application uses a large `styles` object for CSS-in-JS within `DrSnugglesControlCenter.tsx` instead of external CSS files or styled-components.
**Action:** When adding new UI elements to this component, continue adding to the `styles` object to maintain consistency, rather than introducing new styling paradigms.

## 2025-10-27 - Modal Consistency & Dev Environment
**Learning:** Native `window.confirm` dialogs break the immersive dark-mode experience and are not accessible. Also, stale `.js` build artifacts alongside `.tsx` files can silently block HMR updates in this Vite setup.
**Action:** Use the custom `InputModal` for all confirmations. Always ensure no stale `.js` files exist in source folders when working with TypeScript.

## 2025-05-15 - Form Control Association
**Learning:** Many form controls (especially `<select>` elements) were visually labeled but lacked programmatic `id`/`htmlFor` association, making them inaccessible to screen readers. Implicit nesting (input inside label) is not consistently used.
**Action:** Always add unique `id`s to form inputs and matching `htmlFor` attributes to their corresponding labels to ensure robust accessibility.
## 2024-03-24 - Inline Style Overlays and Accessibility
**Learning:** Custom modal overlays built with inline styles often lack critical accessibility attributes (role, aria-modal, focus management) that are typically provided by component libraries or standard modal implementations. This pattern was observed in the Settings modal of `DrSnugglesControlCenter.tsx`.
**Action:** When encountering inline-styled overlays, proactively check for and add `role="dialog"`, `aria-modal="true"`, and appropriate `aria-label`/`aria-labelledby` attributes. Also ensure keyboard interactions like `Escape` to close are implemented manually since there's no library handling it.
