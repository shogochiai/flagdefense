import { GameState, Tetromino, Position, BOARD_WIDTH, BOARD_HEIGHT, TETROMINO_SHAPES, FlagData } from '../types/game';

export class GameEngine {
  private state: GameState;
  private flagData: FlagData[] = [];
  private dropTimer: number = 0;
  private dropInterval: number = 1000; // 1 second
  private placedFlagsCallback?: (flagId: string) => void;

  constructor() {
    this.state = this.createInitialState();
  }

  private createInitialState(): GameState {
    return {
      board: Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null)),
      currentPiece: null,
      nextPiece: null,
      score: 0,
      lines: 0,
      level: 1,
      gameOver: false,
      paused: false
    };
  }

  public loadFlagData(flags: FlagData[]): void {
    this.flagData = flags;
  }

  public onFlagPlaced(callback: (flagId: string) => void): void {
    this.placedFlagsCallback = callback;
  }

  public getState(): GameState {
    return { ...this.state };
  }

  public start(): void {
    this.state = this.createInitialState();
    this.state.currentPiece = this.createRandomTetromino();
    this.state.nextPiece = this.createRandomTetromino();
  }

  public update(deltaTime: number): void {
    if (this.state.paused || this.state.gameOver) return;

    this.dropTimer += deltaTime;
    if (this.dropTimer >= this.dropInterval) {
      this.moveDown();
      this.dropTimer = 0;
    }
  }

  public moveLeft(): void {
    if (!this.state.currentPiece || this.state.paused || this.state.gameOver) return;
    
    const newPosition = { ...this.state.currentPiece.position, x: this.state.currentPiece.position.x - 1 };
    if (this.isValidPosition(this.state.currentPiece, newPosition)) {
      this.state.currentPiece.position = newPosition;
    }
  }

  public moveRight(): void {
    if (!this.state.currentPiece || this.state.paused || this.state.gameOver) return;
    
    const newPosition = { ...this.state.currentPiece.position, x: this.state.currentPiece.position.x + 1 };
    if (this.isValidPosition(this.state.currentPiece, newPosition)) {
      this.state.currentPiece.position = newPosition;
    }
  }

  public moveDown(): void {
    if (!this.state.currentPiece || this.state.paused || this.state.gameOver) return;
    
    const newPosition = { ...this.state.currentPiece.position, y: this.state.currentPiece.position.y + 1 };
    if (this.isValidPosition(this.state.currentPiece, newPosition)) {
      this.state.currentPiece.position = newPosition;
    } else {
      this.lockPiece();
    }
  }

  public hardDrop(): void {
    if (!this.state.currentPiece || this.state.paused || this.state.gameOver) return;
    
    while (this.isValidPosition(this.state.currentPiece, { ...this.state.currentPiece.position, y: this.state.currentPiece.position.y + 1 })) {
      this.state.currentPiece.position.y++;
    }
    this.lockPiece();
  }

  public rotate(): void {
    if (!this.state.currentPiece || this.state.paused || this.state.gameOver) return;
    
    const rotated = this.rotateTetromino(this.state.currentPiece);
    if (this.isValidPosition(rotated, rotated.position)) {
      this.state.currentPiece = rotated;
    }
  }

  public togglePause(): void {
    this.state.paused = !this.state.paused;
  }

  private createRandomTetromino(): Tetromino {
    const shapes = Object.keys(TETROMINO_SHAPES) as (keyof typeof TETROMINO_SHAPES)[];
    const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
    const shape = TETROMINO_SHAPES[randomShape];
    const randomFlag = this.flagData[Math.floor(Math.random() * this.flagData.length)] || { id: 'default' };

    const blocks = [];
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] === 1) {
          blocks.push({
            flagId: randomFlag.id,
            position: { x, y }
          });
        }
      }
    }

    return {
      blocks,
      shape,
      position: { x: Math.floor(BOARD_WIDTH / 2) - Math.floor(shape[0].length / 2), y: 0 },
      flagId: randomFlag.id
    };
  }

  private rotateTetromino(tetromino: Tetromino): Tetromino {
    const rotatedShape = tetromino.shape[0].map((_, index) =>
      tetromino.shape.map(row => row[index]).reverse()
    );

    const blocks = [];
    for (let y = 0; y < rotatedShape.length; y++) {
      for (let x = 0; x < rotatedShape[y].length; x++) {
        if (rotatedShape[y][x] === 1) {
          blocks.push({
            flagId: tetromino.flagId,
            position: { x, y }
          });
        }
      }
    }

    return {
      ...tetromino,
      blocks,
      shape: rotatedShape
    };
  }

  private isValidPosition(tetromino: Tetromino, position: Position): boolean {
    for (const block of tetromino.blocks) {
      const x = position.x + block.position.x;
      const y = position.y + block.position.y;

      if (x < 0 || x >= BOARD_WIDTH || y >= BOARD_HEIGHT) {
        return false;
      }

      if (y >= 0 && this.state.board[y][x] !== null) {
        return false;
      }
    }
    return true;
  }

  private lockPiece(): void {
    if (!this.state.currentPiece) return;

    // Place the piece on the board
    for (const block of this.state.currentPiece.blocks) {
      const x = this.state.currentPiece.position.x + block.position.x;
      const y = this.state.currentPiece.position.y + block.position.y;

      if (y >= 0) {
        this.state.board[y][x] = block.flagId;
      }
    }

    // Notify about placed flag
    if (this.placedFlagsCallback && this.state.currentPiece.flagId) {
      this.placedFlagsCallback(this.state.currentPiece.flagId);
    }

    // Check for completed lines
    const completedLines = this.checkCompletedLines();
    if (completedLines.length > 0) {
      this.clearLines(completedLines);
      this.updateScore(completedLines.length);
    }

    // Spawn next piece
    this.state.currentPiece = this.state.nextPiece;
    this.state.nextPiece = this.createRandomTetromino();

    // Check game over
    if (this.state.currentPiece && !this.isValidPosition(this.state.currentPiece, this.state.currentPiece.position)) {
      this.state.gameOver = true;
    }
  }

  private checkCompletedLines(): number[] {
    const completedLines: number[] = [];
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      if (this.state.board[y].every(cell => cell !== null)) {
        completedLines.push(y);
      }
    }
    return completedLines;
  }

  private clearLines(lines: number[]): void {
    for (const line of lines) {
      this.state.board.splice(line, 1);
      this.state.board.unshift(Array(BOARD_WIDTH).fill(null));
    }
    this.state.lines += lines.length;
    this.state.level = Math.floor(this.state.lines / 10) + 1;
    this.dropInterval = Math.max(100, 1000 - (this.state.level - 1) * 100);
  }

  private updateScore(linesCleared: number): void {
    const scoreMap: { [key: number]: number } = {
      1: 100,
      2: 300,
      3: 500,
      4: 800
    };
    this.state.score += scoreMap[linesCleared] || 0;
  }
}