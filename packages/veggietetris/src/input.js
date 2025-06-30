class InputHandler {
    constructor(game) {
        this.game = game;
        this.keys = {};
        this.keyRepeatDelay = 150;
        this.keyRepeatInterval = 50;
        this.keyTimers = {};
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
    }

    handleKeyDown(e) {
        if (this.keys[e.key]) return;
        
        this.keys[e.key] = true;
        
        switch(e.key) {
        case 'ArrowLeft':
            e.preventDefault();
            this.game.movePiece(-1, 0);
            this.startKeyRepeat(e.key, () => this.game.movePiece(-1, 0));
            break;
                
        case 'ArrowRight':
            e.preventDefault();
            this.game.movePiece(1, 0);
            this.startKeyRepeat(e.key, () => this.game.movePiece(1, 0));
            break;
                
        case 'ArrowDown':
            e.preventDefault();
            this.game.softDrop();
            this.startKeyRepeat(e.key, () => this.game.softDrop());
            break;
                
        case 'ArrowUp':
            e.preventDefault();
            this.game.rotatePiece();
            break;
                
        case ' ':
            e.preventDefault();
            this.game.hardDrop();
            break;
                
        case 'p':
        case 'P':
            e.preventDefault();
            this.game.togglePause();
            break;
                
        case 'r':
        case 'R':
            e.preventDefault();
            this.game.restart();
            break;
            
        case 'v':
        case 'V':
            e.preventDefault();
            this.game.togglePartyMode();
            break;
        }
    }

    handleKeyUp(e) {
        this.keys[e.key] = false;
        this.stopKeyRepeat(e.key);
    }

    startKeyRepeat(key, action) {
        this.keyTimers[key] = setTimeout(() => {
            if (this.keys[key]) {
                this.keyTimers[key] = setInterval(() => {
                    if (this.keys[key] && !this.game.isPaused && !this.game.isGameOver) {
                        action();
                    }
                }, this.keyRepeatInterval);
            }
        }, this.keyRepeatDelay);
    }

    stopKeyRepeat(key) {
        if (this.keyTimers[key]) {
            clearTimeout(this.keyTimers[key]);
            clearInterval(this.keyTimers[key]);
            delete this.keyTimers[key];
        }
    }

    reset() {
        this.keys = {};
        Object.keys(this.keyTimers).forEach(key => {
            this.stopKeyRepeat(key);
        });
    }
}