import { useEffect } from 'react';
import { GameEngine } from '../core/GameEngine';

export const useKeyboardControls = (gameEngine: GameEngine) => {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          gameEngine.moveLeft();
          break;
        case 'ArrowRight':
          event.preventDefault();
          gameEngine.moveRight();
          break;
        case 'ArrowDown':
          event.preventDefault();
          gameEngine.moveDown();
          break;
        case 'ArrowUp':
          event.preventDefault();
          gameEngine.rotate();
          break;
        case ' ':
          event.preventDefault();
          gameEngine.hardDrop();
          break;
        case 'p':
        case 'P':
          event.preventDefault();
          gameEngine.togglePause();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [gameEngine]);
};