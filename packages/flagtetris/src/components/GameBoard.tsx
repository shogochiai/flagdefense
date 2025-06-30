import React, { useEffect, useRef } from 'react';
import { GameState, BOARD_WIDTH, BOARD_HEIGHT, BLOCK_SIZE } from '../types/game';
import { ImageCache } from '../utils/imageCache';
import './GameBoard.css';

interface GameBoardProps {
  gameState: GameState;
  flagImages: Map<string, string>;
}

const imageCache = new ImageCache();

export const GameBoard: React.FC<GameBoardProps> = ({ gameState, flagImages }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Preload flag images
  useEffect(() => {
    const imageSources = Array.from(flagImages.values());
    imageCache.preloadImages(imageSources);
  }, [flagImages]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    for (let x = 0; x <= BOARD_WIDTH; x++) {
      ctx.beginPath();
      ctx.moveTo(x * BLOCK_SIZE, 0);
      ctx.lineTo(x * BLOCK_SIZE, BOARD_HEIGHT * BLOCK_SIZE);
      ctx.stroke();
    }
    for (let y = 0; y <= BOARD_HEIGHT; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * BLOCK_SIZE);
      ctx.lineTo(BOARD_WIDTH * BLOCK_SIZE, y * BLOCK_SIZE);
      ctx.stroke();
    }

    // Draw board
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        const flagId = gameState.board[y][x];
        if (flagId) {
          drawBlock(ctx, x, y, flagId);
        }
      }
    }

    // Draw current piece
    if (gameState.currentPiece) {
      const { position, blocks } = gameState.currentPiece;
      for (const block of blocks) {
        const x = position.x + block.position.x;
        const y = position.y + block.position.y;
        if (y >= 0) {
          drawBlock(ctx, x, y, block.flagId);
        }
      }
    }

    // Draw ghost piece (preview of where piece will land)
    if (gameState.currentPiece && !gameState.paused && !gameState.gameOver) {
      const ghostPiece = { ...gameState.currentPiece };
      while (isValidPosition(ghostPiece, gameState.board)) {
        ghostPiece.position.y++;
      }
      ghostPiece.position.y--;

      ctx.globalAlpha = 0.3;
      for (const block of ghostPiece.blocks) {
        const x = ghostPiece.position.x + block.position.x;
        const y = ghostPiece.position.y + block.position.y;
        if (y >= 0) {
          drawBlock(ctx, x, y, block.flagId);
        }
      }
      ctx.globalAlpha = 1;
    }

    function drawBlock(ctx: CanvasRenderingContext2D, x: number, y: number, flagId: string) {
      const flagImageSrc = flagImages.get(flagId);
      
      if (flagImageSrc && imageCache.has(flagImageSrc)) {
        const img = imageCache.get(flagImageSrc)!;
        ctx.drawImage(img, x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
      } else {
        // Fallback: colored block with country code
        const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];
        const colorIndex = flagId.charCodeAt(0) % colors.length;
        ctx.fillStyle = colors[colorIndex];
        ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
        
        // Draw flag ID text
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(flagId.substring(0, 3).toUpperCase(), x * BLOCK_SIZE + BLOCK_SIZE / 2, y * BLOCK_SIZE + BLOCK_SIZE / 2);
      }
    }

    function isValidPosition(piece: any, board: any): boolean {
      for (const block of piece.blocks) {
        const x = piece.position.x + block.position.x;
        const y = piece.position.y + block.position.y;
        if (x < 0 || x >= BOARD_WIDTH || y >= BOARD_HEIGHT) {
          return false;
        }
        if (y >= 0 && board[y][x] !== null) {
          return false;
        }
      }
      return true;
    }
  }, [gameState, flagImages]);

  return (
    <div className="game-board">
      <canvas
        ref={canvasRef}
        width={BOARD_WIDTH * BLOCK_SIZE}
        height={BOARD_HEIGHT * BLOCK_SIZE}
      />
      {gameState.paused && (
        <div className="overlay">
          <h2>PAUSED</h2>
          <p>Press P to resume</p>
        </div>
      )}
      {gameState.gameOver && (
        <div className="overlay">
          <h2>GAME OVER</h2>
          <p>Score: {gameState.score}</p>
          <p>Lines: {gameState.lines}</p>
        </div>
      )}
    </div>
  );
};