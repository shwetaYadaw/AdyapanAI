import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';

// Apply dark mode before first render to avoid flash
const savedDark = localStorage.getItem('darkMode');
if (savedDark === 'true') {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found. Check index.html has <div id="root">');

ReactDOM.createRoot(root).render(
  <App />
);
