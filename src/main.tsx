import { StrictMode } from 'react';[cite: 4]
import { createRoot } from 'react-dom/client';[cite: 4]
import App from './App.tsx';[cite: 4]
import './index.css';[cite: 4]

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);[cite: 4]