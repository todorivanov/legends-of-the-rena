import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GameProvider } from './context/GameContext';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GameProvider>
      <App />
    </GameProvider>
  </StrictMode>,
);
