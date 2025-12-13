## 2024-05-23 - [High Frequency IPC Updates Cause Massive Re-renders]
**Learning:** React components listening to high-frequency IPC events (like audio levels at 60Hz) via `setState` will trigger full component re-renders on every event. In a large component (2000+ lines), this destroys performance.
**Action:** Extract high-frequency UI elements (meters, graphs) into small, isolated child components that manage their own subscription and state. Use `useRef` for canvas animations to avoid React render cycle entirely.
