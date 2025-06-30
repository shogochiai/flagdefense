import { useState } from 'react'
import { IntegratedGameV5 } from './spike/integrated-game-v5'
import { GameStartScreen, GameSettings } from './spike/game-start-screen'

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameSettings, setGameSettings] = useState<GameSettings | null>(null);

  const handleStartGame = (settings: GameSettings) => {
    setGameSettings(settings);
    setGameStarted(true);
  };

  if (!gameStarted) {
    return <GameStartScreen onStartGame={handleStartGame} />;
  }

  return <IntegratedGameV5 initialSettings={gameSettings!} />;
}

export default App