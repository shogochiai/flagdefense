describe('Tetromino', () => {
    beforeEach(() => {
        global.VEGETABLES = {
            I: { color: '#FF6B35' },
            O: { color: '#FF0000' },
            T: { color: '#6B3AA0' },
            S: { color: '#00A86B' },
            Z: { color: '#FFD700' },
            J: { color: '#228B22' },
            L: { color: '#FF8C00' }
        };
    });

    describe('constructor', () => {
        test('should create tetromino with correct initial properties', () => {
            const tetromino = new Tetromino('T');
            
            expect(tetromino.type).toBe('T');
            expect(tetromino.x).toBe(3);
            expect(tetromino.y).toBe(0);
            expect(tetromino.rotation).toBe(0);
            expect(tetromino.color).toBe('#6B3AA0');
        });
    });

    describe('getBlocks', () => {
        test('should return correct blocks for I piece', () => {
            global.TETROMINO_SHAPES = {
                I: [
                    [0, 0, 0, 0],
                    [1, 1, 1, 1],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                ]
            };
            
            const tetromino = new Tetromino('I');
            const blocks = tetromino.getBlocks();
            
            expect(blocks).toHaveLength(4);
            expect(blocks[0]).toEqual({ x: 3, y: 1, color: '#FF6B35', type: 'I' });
            expect(blocks[1]).toEqual({ x: 4, y: 1, color: '#FF6B35', type: 'I' });
            expect(blocks[2]).toEqual({ x: 5, y: 1, color: '#FF6B35', type: 'I' });
            expect(blocks[3]).toEqual({ x: 6, y: 1, color: '#FF6B35', type: 'I' });
        });
    });

    describe('move', () => {
        test('should update position correctly', () => {
            const tetromino = new Tetromino('O');
            tetromino.move(2, 1);
            
            expect(tetromino.x).toBe(5);
            expect(tetromino.y).toBe(1);
        });
    });

    describe('rotation', () => {
        test('should rotate clockwise correctly', () => {
            const tetromino = new Tetromino('T');
            tetromino.rotateClockwise();
            
            expect(tetromino.rotation).toBe(1);
            
            tetromino.rotateClockwise();
            tetromino.rotateClockwise();
            tetromino.rotateClockwise();
            
            expect(tetromino.rotation).toBe(0);
        });

        test('should rotate counter-clockwise correctly', () => {
            const tetromino = new Tetromino('T');
            tetromino.rotateCounterClockwise();
            
            expect(tetromino.rotation).toBe(3);
        });
    });

    describe('clone', () => {
        test('should create independent copy', () => {
            const original = new Tetromino('L');
            original.move(2, 3);
            original.rotateClockwise();
            
            const cloned = original.clone();
            
            expect(cloned.type).toBe(original.type);
            expect(cloned.x).toBe(original.x);
            expect(cloned.y).toBe(original.y);
            expect(cloned.rotation).toBe(original.rotation);
            
            cloned.move(1, 1);
            expect(original.x).not.toBe(cloned.x);
        });
    });
});