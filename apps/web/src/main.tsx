import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';

// Apply dark mode before first render to avoid flash
const savedDark = localStorage.getItem('darkMode');
if (savedDark === 'true') {
  document.documentElement.classList.add('dark');
} else if (savedDark === null && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.documentElement.classList.add('dark');
}

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found. Check index.html has <div id="root">');

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
