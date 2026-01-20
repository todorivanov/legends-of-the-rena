import { useContext } from 'react';
import { GameContext } from '../context/GameContext';

/**
 * Custom hook for accessing game state and dispatch
 */
export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
}
