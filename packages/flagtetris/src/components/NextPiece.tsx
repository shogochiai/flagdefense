import React, { useEffect, useRef } from 'react';
import { Tetromino, BLOCK_SIZE } from '../types/game';
import { ImageCache } from '../utils/imageCache';
import './NextPiece.css';

interface NextPieceProps {
  nextPiece: Tetromino | null;
  flagImages: Map<string, string>;
}

const imageCache = new ImageCache();

export const NextPiece: React.FC<NextPieceProps> = ({ nextPiece, flagImages }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !nextPiece) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Center the piece in the preview
    const offsetX = (canvas.width - nextPiece.shape[0].length * BLOCK_SIZE) / 2;
    const offsetY = (canvas.height - nextPiece.shape.length * BLOCK_SIZE) / 2;

    for (const block of nextPiece.blocks) {
      const x = offsetX + block.position.x * BLOCK_SIZE;
      const y = offsetY + block.position.y * BLOCK_SIZE;

      const flagImageSrc = flagImages.get(block.flagId);
      
      if (flagImageSrc && imageCache.has(flagImageSrc)) {
        const img = imageCache.get(flagImageSrc)!;
        ctx.drawImage(img, x, y, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
      } else {
        // Fallback: colored block with country code
        const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];
        const colorIndex = block.flagId.charCodeAt(0) % colors.length;
        ctx.fillStyle = colors[colorIndex];
        ctx.fillRect(x, y, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
        
        // Draw flag ID text
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(block.flagId.substring(0, 3).toUpperCase(), x + BLOCK_SIZE / 2, y + BLOCK_SIZE / 2);
      }
    }
  }, [nextPiece, flagImages]);

  return (
    <div className="next-piece">
      <h3>Next</h3>
      <canvas
        ref={canvasRef}
        width={150}
        height={100}
      />
    </div>
  );
};