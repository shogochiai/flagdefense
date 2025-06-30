class Renderer {
    constructor(canvas, nextCanvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.nextCanvas = nextCanvas;
        this.nextCtx = nextCanvas.getContext('2d');
        this.blockSize = 30;
        this.boardWidth = 10;
        this.boardHeight = 20;
        this.imageCache = {};
        this.loadImages();
    }

    loadImages() {
        Object.entries(VEGETABLES).forEach(([type, vegetable]) => {
            const img = new Image();
            img.src = vegetable.image;
            img.onload = () => {
                this.imageCache[type] = img;
            };
        });
    }

    clear() {
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 1;
        
        for (let x = 0; x <= this.boardWidth; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * this.blockSize, 0);
            this.ctx.lineTo(x * this.blockSize, this.canvas.height);
            this.ctx.stroke();
        }
        
        for (let y = 0; y <= this.boardHeight; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * this.blockSize);
            this.ctx.lineTo(this.canvas.width, y * this.blockSize);
            this.ctx.stroke();
        }
    }

    drawBlock(x, y, color, ctx = this.ctx, blockSize = this.blockSize, type = null) {
        const blockX = x * blockSize;
        const blockY = y * blockSize;
        
        ctx.fillStyle = color;
        ctx.fillRect(
            blockX + 1,
            blockY + 1,
            blockSize - 2,
            blockSize - 2
        );
        
        if (type && this.imageCache[type]) {
            ctx.drawImage(
                this.imageCache[type],
                blockX + 2,
                blockY + 2,
                blockSize - 4,
                blockSize - 4
            );
        } else {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.fillRect(
                blockX + 1,
                blockY + 1,
                blockSize - 2,
                4
            );
            
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.fillRect(
                blockX + 1,
                blockY + blockSize - 5,
                blockSize - 2,
                4
            );
        }
    }

    drawBoard(board) {
        for (let y = 0; y < board.height; y++) {
            for (let x = 0; x < board.width; x++) {
                const cell = board.getCell(x, y);
                if (cell) {
                    this.drawBlock(x, y, cell.color, this.ctx, this.blockSize, cell.type);
                }
            }
        }
    }

    drawTetromino(tetromino) {
        const blocks = tetromino.getBlocks();
        blocks.forEach(block => {
            if (block.y >= 0) {
                this.drawBlock(block.x, block.y, block.color, this.ctx, this.blockSize, block.type);
            }
        });
    }

    drawGhostPiece(tetromino, board) {
        const ghost = tetromino.clone();
        
        while (board.isValidPosition(ghost)) {
            ghost.y++;
        }
        ghost.y--;
        
        const blocks = ghost.getBlocks();
        blocks.forEach(block => {
            if (block.y >= 0) {
                this.ctx.fillStyle = `${block.color}33`;
                this.ctx.fillRect(
                    block.x * this.blockSize + 1,
                    block.y * this.blockSize + 1,
                    this.blockSize - 2,
                    this.blockSize - 2
                );
                
                this.ctx.strokeStyle = `${block.color}66`;
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(
                    block.x * this.blockSize + 2,
                    block.y * this.blockSize + 2,
                    this.blockSize - 4,
                    this.blockSize - 4
                );
            }
        });
    }

    drawNextPiece(tetromino) {
        this.nextCtx.fillStyle = '#1a1a1a';
        this.nextCtx.fillRect(0, 0, this.nextCanvas.width, this.nextCanvas.height);
        
        if (!tetromino) return;
        
        const shape = tetromino.getRotatedShape();
        const blockSize = 20;
        const offsetX = (this.nextCanvas.width - shape[0].length * blockSize) / 2;
        const offsetY = (this.nextCanvas.height - shape.length * blockSize) / 2;
        
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const x = offsetX / blockSize + col;
                    const y = offsetY / blockSize + row;
                    this.nextCtx.save();
                    this.nextCtx.translate(offsetX, offsetY);
                    this.drawBlock(
                        col,
                        row,
                        tetromino.color,
                        this.nextCtx,
                        blockSize,
                        tetromino.type
                    );
                    this.nextCtx.restore();
                }
            }
        }
    }

    render(board, currentPiece, nextPiece) {
        this.clear();
        this.drawBoard(board);
        
        if (currentPiece) {
            this.drawGhostPiece(currentPiece, board);
            this.drawTetromino(currentPiece);
        }
        
        this.drawNextPiece(nextPiece);
    }
}