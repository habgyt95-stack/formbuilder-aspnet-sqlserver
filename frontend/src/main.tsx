import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import type { FormBuilderOptions } from './types';

// Mountable function for standalone usage
declare global {
  interface Window {
    mountFormBuilder: (container: HTMLElement, options?: FormBuilderOptions) => void;
  }
}

window.mountFormBuilder = (container: HTMLElement, options?: FormBuilderOptions) => {
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <App options={options} />
    </StrictMode>
  );

  // Send init message for iframe
  if (window.parent !== window) {
    window.parent.postMessage({ type: 'init' }, '*');
  }

  // Call onInit callback
  options?.onInit?.();
};

// Auto-mount if #root exists (for development)
const rootElement = document.getElementById('root');
if (rootElement) {
  window.mountFormBuilder(rootElement);
}
