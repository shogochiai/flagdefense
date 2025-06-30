import { useState, useEffect, useRef, useCallback } from 'react';
import { GameEngine } from './core/GameEngine';
import { GameBoard } from './components/GameBoard';
import { NextPiece } from './components/NextPiece';
import { ScoreBoard } from './components/ScoreBoard';
import { Controls } from './components/Controls';
import { FlagInfo } from './components/FlagInfo';
import { useGameLoop } from './hooks/useGameLoop';
import { useKeyboardControls } from './hooks/useKeyboardControls';
import { FlagData } from './types/game';
import { loadFlagData, loadFlagImages } from './utils/flagLoader';
import './App.css';

function App() {
  const gameEngineRef = useRef<GameEngine>(new GameEngine());
  const [gameState, setGameState] = useState(gameEngineRef.current.getState());
  const [hasStarted, setHasStarted] = useState(false);
  const [flagImages, setFlagImages] = useState(new Map<string, string>());
  const [flagData, setFlagData] = useState<FlagData[]>([]);
  const [recentFlags, setRecentFlags] = useState<string[]>([]);

  useEffect(() => {
    // Load flag data and images
    const loadAssets = async () => {
      const flags = await loadFlagData();
      const images = await loadFlagImages(flags);
      
      setFlagData(flags);
      setFlagImages(images);
      gameEngineRef.current.loadFlagData(flags);
    };
    
    loadAssets();

    // Set up flag placed callback
    gameEngineRef.current.onFlagPlaced((flagId: string) => {
      setRecentFlags(prev => [flagId, ...prev].slice(0, 10));
    });
  }, []);

  const updateGameState = useCallback(() => {
    setGameState(gameEngineRef.current.getState());
  }, []);

  useGameLoop(gameEngineRef.current, updateGameState);
  useKeyboardControls(gameEngineRef.current);

  const handleStart = () => {
    gameEngineRef.current.start();
    setHasStarted(true);
    updateGameState();
  };

  return (
    <div className="app">
      <h1>Flag Tetris</h1>
      
      <div className="game-container">
        <div className="side-panel">
          <ScoreBoard gameState={gameState} />
          <NextPiece nextPiece={gameState.nextPiece} flagImages={flagImages} />
          <Controls />
        </div>
        
        <div className="main-area">
          <GameBoard gameState={gameState} flagImages={flagImages} />
          {!hasStarted && (
            <button className="start-button" onClick={handleStart}>
              Start Game
            </button>
          )}
        </div>
        
        <div className="side-panel">
          <FlagInfo 
            currentFlagId={gameState.currentPiece?.flagId || null}
            recentFlags={recentFlags}
            flagData={flagData}
          />
        </div>
      </div>
    </div>
  );
}

export default App;