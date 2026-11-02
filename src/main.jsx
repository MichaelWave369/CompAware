import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';
import './styles-haven.css';
import './styles-study.css';
import './styles-cosmos.css';
import './styles-horizon.css';
import './styles-r3.css';
import './styles-r4.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

