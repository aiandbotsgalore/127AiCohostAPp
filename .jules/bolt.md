## 2024-05-23 - [High Frequency IPC Updates Cause Massive Re-renders]
**Learning:** React components listening to high-frequency IPC events (like audio levels at 60Hz) via `setState` will trigger full component re-renders on every event. In a large component (2000+ lines), this destroys performance.
**Action:** Extract high-frequency UI elements (meters, graphs) into small, isolated child components that manage their own subscription and state. Use `useRef` for canvas animations to avoid React render cycle entirely.

## 2025-06-25 - [AudioMeterWidget Isolated State]
**Learning:** The `AudioMeterWidget` was correctly isolated to use its own `useState` and `useEffect` for `audio-level` events, preventing the parent `DrSnugglesControlCenter` from re-rendering 60 times a second.
**Action:** Always verify if child components are indeed isolated. If `AudioMeterWidget` accepted `level` as a prop from the parent, the optimization would be lost.
