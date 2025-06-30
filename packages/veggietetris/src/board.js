class Board {
    constructor(width = 10, height = 20) {
        this.width = width;
        this.height = height;
        this.grid = this.createEmptyGrid();
        this.vegetableStats = {};
        
        Object.keys(VEGETABLES).forEach(type => {
            this.vegetableStats[type] = 0;
        });
    }

    createEmptyGrid() {
        return Array(this.height).fill().map(() => 
            Array(this.width).fill(null)
        );
    }

    isValidPosition(tetromino) {
        const blocks = tetromino.getBlocks();
        
        for (const block of blocks) {
            if (block.x < 0 || block.x >= this.width || 
                block.y < 0 || block.y >= this.height) {
                return false;
            }
            
            if (this.grid[block.y][block.x] !== null) {
                return false;
            }
        }
        
        return true;
    }

    placeTetromino(tetromino) {
        const blocks = tetromino.getBlocks();
        
        blocks.forEach(block => {
            if (block.y >= 0 && block.y < this.height && 
                block.x >= 0 && block.x < this.width) {
                this.grid[block.y][block.x] = {
                    color: block.color,
                    type: block.type
                };
            }
        });
        
        this.vegetableStats[tetromino.type]++;
        this.updateVegetableCollection(tetromino.type);
    }

    updateVegetableCollection(type) {
        const vegetableItem = document.querySelector(`[data-vegetable="${type.toLowerCase()}"]`);
        if (vegetableItem) {
            const countElement = vegetableItem.querySelector('.count');
            if (countElement) {
                countElement.textContent = this.vegetableStats[type];
            }
        }
    }

    clearFullLines() {
        const clearedLines = [];
        const clearedVegetables = [];
        
        for (let y = this.height - 1; y >= 0; y--) {
            if (this.grid[y].every(cell => cell !== null)) {
                const vegetableTypes = new Set();
                this.grid[y].forEach(cell => {
                    if (cell && cell.type) {
                        vegetableTypes.add(cell.type);
                    }
                });
                
                clearedVegetables.push(...Array.from(vegetableTypes));
                clearedLines.push(y);
                this.grid.splice(y, 1);
                this.grid.unshift(Array(this.width).fill(null));
                y++;
            }
        }
        
        return { count: clearedLines.length, vegetables: clearedVegetables };
    }

    isGameOver() {
        return this.grid[0].some(cell => cell !== null);
    }

    getCell(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return null;
        }
        return this.grid[y][x];
    }

    reset() {
        this.grid = this.createEmptyGrid();
        Object.keys(this.vegetableStats).forEach(type => {
            this.vegetableStats[type] = 0;
        });
        
        document.querySelectorAll('.vegetable-item .count').forEach(count => {
            count.textContent = '0';
        });
    }

    getTotalVegetables() {
        return Object.values(this.vegetableStats).reduce((sum, count) => sum + count, 0);
    }
}