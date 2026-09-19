 import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx'
window.addEventListener('error', (e) => console.error('GLOBAL ERROR:', e.message, e.filename, e.lineno));
window.addEventListener('unhandledrejection', (e) => {
  if (e.reason && e.reason.message && e.reason.message.toLowerCase().includes('websocket')) {
    e.preventDefault();
    return;
  }
  if (!e.reason) {
    e.preventDefault();
    return;
  }
  console.error('UNHANDLED PROMISE:', e.reason);
});
;
import './index.css';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
