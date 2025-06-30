const TETROMINO_SHAPES = {
    I: [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    O: [
        [1, 1],
        [1, 1]
    ],
    T: [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    S: [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ],
    Z: [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ],
    J: [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    L: [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
    ]
};

class Tetromino {
    constructor(type) {
        this.type = type;
        this.shape = TETROMINO_SHAPES[type];
        this.vegetable = VEGETABLES[type];
        this.color = this.vegetable.color;
        this.x = 3;
        this.y = 0;
        this.rotation = 0;
    }

    rotate() {
        const n = this.shape.length;
        const rotated = Array(n).fill().map(() => Array(n).fill(0));
        
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                rotated[j][n - 1 - i] = this.shape[i][j];
            }
        }
        
        return rotated;
    }

    getRotatedShape() {
        let shape = this.shape;
        for (let i = 0; i < this.rotation; i++) {
            const n = shape.length;
            const rotated = Array(n).fill().map(() => Array(n).fill(0));
            
            for (let row = 0; row < n; row++) {
                for (let col = 0; col < n; col++) {
                    rotated[col][n - 1 - row] = shape[row][col];
                }
            }
            shape = rotated;
        }
        return shape;
    }

    move(dx, dy) {
        this.x += dx;
        this.y += dy;
    }

    rotateClockwise() {
        this.rotation = (this.rotation + 1) % 4;
    }

    rotateCounterClockwise() {
        this.rotation = (this.rotation + 3) % 4;
    }

    getBlocks() {
        const blocks = [];
        const shape = this.getRotatedShape();
        
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    blocks.push({
                        x: this.x + col,
                        y: this.y + row,
                        color: this.color,
                        type: this.type
                    });
                }
            }
        }
        
        return blocks;
    }

    clone() {
        const cloned = new Tetromino(this.type);
        cloned.x = this.x;
        cloned.y = this.y;
        cloned.rotation = this.rotation;
        return cloned;
    }
}

function getRandomTetromino() {
    const types = Object.keys(TETROMINO_SHAPES);
    const randomType = types[Math.floor(Math.random() * types.length)];
    return new Tetromino(randomType);
}