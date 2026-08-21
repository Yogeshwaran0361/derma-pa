import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './index.css';

// Automatic localStorage sanitization to prevent null pointer exceptions from legacy test cache
try {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('dermavision_') || key.startsWith('appointments_') || key.startsWith('notifications_')) {
      const val = localStorage.getItem(key);
      if (!val || val === 'null' || val === 'undefined') {
        localStorage.removeItem(key);
      } else {
        try {
          const parsed = JSON.parse(val);
          if (Array.isArray(parsed)) {
            const clean = parsed.filter((item) => item && typeof item === 'object' && Boolean(item.id || item.scanId));
            localStorage.setItem(key, JSON.stringify(clean));
          }
        } catch (e) {
          localStorage.removeItem(key);
        }
      }
    }
  });
} catch (e) {}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
