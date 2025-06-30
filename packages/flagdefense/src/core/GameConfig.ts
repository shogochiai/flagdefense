export interface GameConfig {
  canvas: {
    width: number;
    height: number;
    backgroundColor: string;
  };
  
  tower: {
    baseX: number;
    baseY: number;
    width: number;
    height: number;
  };
  
  assets: {
    flagSize: {
      width: number;
      height: number;
    };
    borderRadius: number;
    shadowBlur: number;
  };
  
  gameplay: {
    startingMoney: number;
    startingLives: number;
    enemySpawnInterval: number;
    enemySpeed: number;
    difficultyMultiplier: number;
  };
  
  ui: {
    shopPosition: {
      x: number;
      y: number;
    };
    statsPosition: {
      x: number; 
      y: number;
    };
  };
}

export const defaultGameConfig: GameConfig = {
  canvas: {
    width: 1024,
    height: 768,
    backgroundColor: '#87CEEB'
  },
  
  tower: {
    baseX: 150,
    baseY: 400,
    width: 100,
    height: 300
  },
  
  assets: {
    flagSize: {
      width: 60,
      height: 40
    },
    borderRadius: 4,
    shadowBlur: 5
  },
  
  gameplay: {
    startingMoney: 1000,
    startingLives: 20,
    enemySpawnInterval: 3000,
    enemySpeed: 1,
    difficultyMultiplier: 1.1
  },
  
  ui: {
    shopPosition: {
      x: 800,
      y: 50
    },
    statsPosition: {
      x: 50,
      y: 50
    }
  }
};