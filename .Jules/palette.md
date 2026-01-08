## 2025-05-24 - Dynamic Toast Roles
**Learning:** Toast notifications often default to `role="status"` or no role at all. However, critical errors need `role="alert"` (assertive) to interrupt screen readers immediately, while success messages should use `role="status"` (polite) to avoid jarring interruptions.
**Action:** Always dynamically set `role` and `aria-live` attributes on toast components based on the message type (error vs. success).
