import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app';
import { appLogger } from './services/logger';
import './app/i18n';
import './variables.css';
import './global.scss';

window.addEventListener('beforeunload', () => appLogger.destroy());

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
