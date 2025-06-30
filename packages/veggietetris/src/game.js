class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.nextCanvas = document.getElementById('nextCanvas');
        
        this.board = new Board();
        this.renderer = new Renderer(this.canvas, this.nextCanvas);
        this.storage = new Storage();
        this.inputHandler = new InputHandler(this);
        
        this.currentPiece = null;
        this.nextPiece = null;
        this.score = 0;
        this.lines = 0;
        this.level = 1;
        this.dropInterval = 1000;
        this.lastDropTime = 0;
        
        this.isPaused = false;
        this.isGameOver = false;
        this.partyMode = false;
        this.veggieRotationCounter = 0;
        
        this.init();
    }

    init() {
        this.currentPiece = getRandomTetromino();
        this.nextPiece = getRandomTetromino();
        this.updateDisplay();
        this.gameLoop();
    }

    gameLoop(timestamp = 0) {
        if (!this.isPaused && !this.isGameOver) {
            if (timestamp - this.lastDropTime > this.dropInterval) {
                this.dropPiece();
                this.lastDropTime = timestamp;
            }
        }
        
        this.renderer.render(this.board, this.currentPiece, this.nextPiece);
        requestAnimationFrame((t) => this.gameLoop(t));
    }

    dropPiece() {
        const moved = this.movePiece(0, 1);
        if (!moved) {
            this.lockPiece();
        }
    }

    movePiece(dx, dy) {
        if (!this.currentPiece || this.isPaused || this.isGameOver) return false;
        
        this.currentPiece.move(dx, dy);
        
        if (!this.board.isValidPosition(this.currentPiece)) {
            this.currentPiece.move(-dx, -dy);
            return false;
        }
        
        return true;
    }

    rotatePiece() {
        if (!this.currentPiece || this.isPaused || this.isGameOver) return;
        
        this.currentPiece.rotateClockwise();
        
        if (!this.board.isValidPosition(this.currentPiece)) {
            if (!this.tryWallKick()) {
                this.currentPiece.rotateCounterClockwise();
            }
        }
    }

    tryWallKick() {
        const kicks = [
            { x: -1, y: 0 },
            { x: 1, y: 0 },
            { x: 0, y: -1 },
            { x: -2, y: 0 },
            { x: 2, y: 0 }
        ];
        
        for (const kick of kicks) {
            this.currentPiece.move(kick.x, kick.y);
            if (this.board.isValidPosition(this.currentPiece)) {
                return true;
            }
            this.currentPiece.move(-kick.x, -kick.y);
        }
        
        return false;
    }

    softDrop() {
        if (this.movePiece(0, 1)) {
            this.score += 1;
            this.updateDisplay();
        }
    }

    hardDrop() {
        if (!this.currentPiece || this.isPaused || this.isGameOver) return;
        
        let dropDistance = 0;
        while (this.movePiece(0, 1)) {
            dropDistance++;
        }
        
        this.score += dropDistance * 2;
        this.updateDisplay();
        this.lockPiece();
    }

    lockPiece() {
        this.board.placeTetromino(this.currentPiece);
        updateVegetableDisplay(this.currentPiece.type);
        
        const cleared = this.board.clearFullLines();
        if (cleared.count > 0) {
            this.handleLinesCleared(cleared);
        }
        
        this.spawnNextPiece();
        
        if (this.board.isGameOver()) {
            this.endGame();
        }
    }

    handleLinesCleared(cleared) {
        this.lines += cleared.count;
        
        const lineScores = [0, 100, 300, 500, 800];
        this.score += lineScores[cleared.count] * this.level;
        
        // Party mode bonus!
        if (this.partyMode) {
            this.score += lineScores[cleared.count] * 0.5;
        }
        
        // Special celebrations for multiple lines
        if (cleared.count === 4) {
            this.showCelebration('🎆 TETRIS! 🎆');
        } else if (cleared.count >= 2) {
            this.showCelebration('🎉 COMBO! 🎉');
        }
        
        if (this.lines >= this.level * 10) {
            this.level++;
            this.dropInterval = Math.max(100, 1000 - (this.level - 1) * 100);
            this.showCelebration(`🎆 LEVEL ${this.level}! 🎆`);
        }
        
        cleared.vegetables.forEach(type => {
            const fact = getRandomFact(type);
            if (fact) {
                this.showVegetableFact(type, fact);
            }
        });
        
        this.updateDisplay();
    }

    showVegetableFact(type, fact) {
        const vegetable = VEGETABLES[type];
        if (!vegetable) return;
        
        const factElement = document.querySelector('.vegetable-fact');
        if (factElement) {
            factElement.textContent = fact;
            factElement.style.animation = 'none';
            setTimeout(() => {
                factElement.style.animation = 'pulse 0.5s ease-in-out';
            }, 10);
        }
    }

    spawnNextPiece() {
        this.currentPiece = this.nextPiece;
        this.nextPiece = getRandomTetromino();
        
        // Rotate vegetables every few pieces in party mode
        this.veggieRotationCounter++;
        if (this.partyMode && this.veggieRotationCounter % 5 === 0) {
            this.rotateAllVegetables();
        }
        
        if (!this.board.isValidPosition(this.currentPiece)) {
            this.currentPiece.y = -1;
        }
    }
    
    rotateAllVegetables() {
        Object.keys(SHAPE_TO_VEGGIES).forEach(shape => {
            rotateVegetableForShape(shape);
        });
        this.showCelebration('🎉 VEGGIE SHUFFLE! 🎉');
    }
    
    togglePartyMode() {
        this.partyMode = !this.partyMode;
        const container = document.querySelector('.game-container');
        if (this.partyMode) {
            container.classList.add('party-mode');
            randomizeAllVegetables();
            this.showCelebration('🎆 PARTY MODE! 🎆');
        } else {
            container.classList.remove('party-mode');
        }
    }
    
    showCelebration(message) {
        const celebration = document.createElement('div');
        celebration.className = 'celebration';
        celebration.textContent = message;
        document.body.appendChild(celebration);
        
        // Add confetti
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b'][Math.floor(Math.random() * 5)];
            confetti.style.animationDelay = Math.random() * 0.5 + 's';
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 3000);
        }
        
        setTimeout(() => celebration.remove(), 2000);
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        const pauseOverlay = document.querySelector('.pause-overlay');
        if (pauseOverlay) {
            pauseOverlay.style.display = this.isPaused ? 'flex' : 'none';
        }
    }

    updateDisplay() {
        document.querySelector('.score').textContent = this.score;
        document.querySelector('.level').textContent = this.level;
        document.querySelector('.lines').textContent = this.lines;
    }

    endGame() {
        this.isGameOver = true;
        
        const isNewHighScore = this.storage.saveHighScore(this.score);
        this.storage.updateGameStats(this.score, this.lines, this.board.vegetableStats);
        
        const gameOverOverlay = document.querySelector('.game-over-overlay');
        if (gameOverOverlay) {
            gameOverOverlay.style.display = 'flex';
            gameOverOverlay.querySelector('.final-score span').textContent = this.score;
            gameOverOverlay.querySelector('.vegetables-collected span').textContent = 
                this.board.getTotalVegetables();
            
            if (isNewHighScore) {
                const h2 = gameOverOverlay.querySelector('h2');
                h2.textContent = 'New High Score!';
                h2.style.color = '#FFD700';
            }
        }
    }

    restart() {
        this.board.reset();
        this.score = 0;
        this.lines = 0;
        this.level = 1;
        this.dropInterval = 1000;
        this.lastDropTime = 0;
        this.isPaused = false;
        this.isGameOver = false;
        
        this.currentPiece = getRandomTetromino();
        this.nextPiece = getRandomTetromino();
        
        document.querySelector('.game-over-overlay').style.display = 'none';
        document.querySelector('.pause-overlay').style.display = 'none';
        
        this.updateDisplay();
        
        const factElement = document.querySelector('.vegetable-fact');
        if (factElement) {
            factElement.textContent = 'ゲームを始めて野菜について学ぼう！';
        }
    }
}

let game;

function restartGame() {
    if (game) {
        game.restart();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    game = new Game();
});