import React from 'react';
import { GameState } from '../types/game';
import './ScoreBoard.css';

interface ScoreBoardProps {
  gameState: GameState;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ gameState }) => {
  return (
    <div className="score-board">
      <div className="score-item">
        <label>Score</label>
        <div className="score-value">{gameState.score}</div>
      </div>
      <div className="score-item">
        <label>Lines</label>
        <div className="score-value">{gameState.lines}</div>
      </div>
      <div className="score-item">
        <label>Level</label>
        <div className="score-value">{gameState.level}</div>
      </div>
    </div>
  );
};