import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app';
import { logger } from './services/logger';
import { initSentry } from './services/sentry';
import './app/i18n';
import './variables.css';
import './global.scss';

initSentry();

window.addEventListener('beforeunload', () => logger.destroy());

logger.info('App: bootstrap', { env: import.meta.env.MODE });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
