import { useEffect, useRef } from 'react';
import { GameEngine } from '../core/GameEngine';

export const useGameLoop = (gameEngine: GameEngine, onUpdate: () => void) => {
  const animationFrameId = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    const gameLoop = (timestamp: number) => {
      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      gameEngine.update(deltaTime);
      onUpdate();

      animationFrameId.current = requestAnimationFrame(gameLoop);
    };

    animationFrameId.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [gameEngine, onUpdate]);
};