describe('Board', () => {
    let board;
    
    beforeEach(() => {
        global.VEGETABLES = {
            T: { color: '#6B3AA0' }
        };
        
        global.document = {
            querySelector: jest.fn(),
            querySelectorAll: jest.fn()
        };
        
        board = new Board(10, 20);
    });

    describe('constructor', () => {
        test('should create empty board with correct dimensions', () => {
            expect(board.width).toBe(10);
            expect(board.height).toBe(20);
            expect(board.grid.length).toBe(20);
            expect(board.grid[0].length).toBe(10);
            expect(board.grid.every(row => row.every(cell => cell === null))).toBe(true);
        });
    });

    describe('isValidPosition', () => {
        test('should return true for valid position', () => {
            const tetromino = {
                getBlocks: () => [
                    { x: 4, y: 0 },
                    { x: 5, y: 0 }
                ]
            };
            
            expect(board.isValidPosition(tetromino)).toBe(true);
        });

        test('should return false for out of bounds position', () => {
            const tetromino = {
                getBlocks: () => [
                    { x: -1, y: 0 }
                ]
            };
            
            expect(board.isValidPosition(tetromino)).toBe(false);
        });

        test('should return false for occupied position', () => {
            board.grid[0][4] = { color: '#FF0000', type: 'O' };
            
            const tetromino = {
                getBlocks: () => [
                    { x: 4, y: 0 }
                ]
            };
            
            expect(board.isValidPosition(tetromino)).toBe(false);
        });
    });

    describe('placeTetromino', () => {
        test('should place tetromino on board', () => {
            const tetromino = {
                type: 'T',
                getBlocks: () => [
                    { x: 4, y: 0, color: '#6B3AA0', type: 'T' },
                    { x: 5, y: 0, color: '#6B3AA0', type: 'T' }
                ]
            };
            
            board.placeTetromino(tetromino);
            
            expect(board.grid[0][4]).toEqual({ color: '#6B3AA0', type: 'T' });
            expect(board.grid[0][5]).toEqual({ color: '#6B3AA0', type: 'T' });
            expect(board.vegetableStats['T']).toBe(1);
        });
    });

    describe('clearFullLines', () => {
        test('should clear full lines and return count', () => {
            for (let x = 0; x < 10; x++) {
                board.grid[19][x] = { color: '#FF0000', type: 'O' };
            }
            
            const result = board.clearFullLines();
            
            expect(result.count).toBe(1);
            expect(board.grid[19].every(cell => cell === null)).toBe(true);
        });

        test('should not clear incomplete lines', () => {
            for (let x = 0; x < 9; x++) {
                board.grid[19][x] = { color: '#FF0000', type: 'O' };
            }
            
            const result = board.clearFullLines();
            
            expect(result.count).toBe(0);
            expect(board.grid[19][0]).not.toBe(null);
        });
    });

    describe('isGameOver', () => {
        test('should return false for empty top row', () => {
            expect(board.isGameOver()).toBe(false);
        });

        test('should return true if top row has blocks', () => {
            board.grid[0][4] = { color: '#FF0000', type: 'O' };
            expect(board.isGameOver()).toBe(true);
        });
    });

    describe('reset', () => {
        test('should clear board and reset stats', () => {
            board.grid[0][0] = { color: '#FF0000', type: 'O' };
            board.vegetableStats['O'] = 5;
            
            board.reset();
            
            expect(board.grid[0][0]).toBe(null);
            expect(board.vegetableStats['O']).toBe(0);
        });
    });
});