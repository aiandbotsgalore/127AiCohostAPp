import ReactDOM from 'react-dom/client';
import App from './App';

/**
 * The entry point for the Snuggles Audio Node renderer application.
 *
 * Mounts the `App` component to the DOM root.
 * Note: StrictMode is intentionally disabled to prevent double-mounting
 * which causes service re-initialization loops in Electron context.
 */
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(<App />);
