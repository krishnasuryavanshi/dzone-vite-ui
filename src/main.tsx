import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app';
import './app/i18n';
import './variables.css';
import './global.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
