# シーケンス図と状態遷移図

## シーケンス図

### 1. ゲーム開始シーケンス
```mermaid
sequenceDiagram
    participant User
    participant SaveSelectScreen
    participant SaveManager
    participant Game
    participant Managers

    User->>SaveSelectScreen: アプリ起動
    SaveSelectScreen->>SaveManager: getAllSaves()
    SaveManager-->>SaveSelectScreen: SaveData[]
    SaveSelectScreen-->>User: セーブ一覧表示
    
    alt 新規ゲーム
        User->>SaveSelectScreen: 新規作成クリック
        SaveSelectScreen->>SaveManager: createSave()
        SaveManager-->>SaveSelectScreen: newSaveId
    else 既存セーブ
        User->>SaveSelectScreen: セーブ選択
    end
    
    SaveSelectScreen->>Game: initialize(saveId)
    Game->>SaveManager: loadSave(saveId)
    SaveManager-->>Game: SaveData
    Game->>Managers: 各マネージャー初期化
    Game-->>User: ゲーム画面表示
```

### 2. Wave進行シーケンス
```mermaid
sequenceDiagram
    participant Game
    participant WaveManager
    participant EnemyManager
    participant GachaSystem
    participant UI

    Game->>WaveManager: startWave(n)
    WaveManager->>WaveManager: generateEnemies()
    
    loop 敵生成
        WaveManager->>EnemyManager: spawnEnemy()
        EnemyManager-->>Game: 敵配置完了
    end
    
    loop ゲームループ
        Game->>EnemyManager: updateEnemies()
        Game->>TowerManager: processTowerAttacks()
        
        alt 敵撃破
            EnemyManager->>Game: enemyDefeated(reward)
            Game->>Game: addCoins(reward)
        else 基地到達
            EnemyManager->>Game: enemyReachedBase()
            Game->>Game: takeDamage()
        end
    end
    
    WaveManager->>Game: waveComplete()
    Game->>GachaSystem: pullGacha()
    GachaSystem-->>UI: showGachaResult()
```

### 3. タワー配置シーケンス
```mermaid
sequenceDiagram
    participant User
    participant FlagInventory
    participant TowerManager
    participant Game
    participant Canvas

    User->>FlagInventory: 国旗選択
    FlagInventory-->>User: 選択状態表示
    User->>Canvas: クリック(x, y)
    Canvas->>TowerManager: canPlaceTower(x, y)
    
    alt 配置可能
        TowerManager->>Game: checkCoins(cost)
        alt コイン十分
            Game->>Game: deductCoins(cost)
            TowerManager->>TowerManager: placeTower(nationId, x, y)
            TowerManager-->>Canvas: 配置完了
        else コイン不足
            Game-->>User: エラー表示
        end
    else 配置不可
        TowerManager-->>User: エラー表示
    end
```

### 4. オートセーブシーケンス
```mermaid
sequenceDiagram
    participant Game
    participant SaveManager
    participant Timer

    loop ゲーム中
        Game->>Game: 状態変更
        Game->>Timer: resetAutoSaveTimer()
        Timer-->>Timer: 5秒待機
        Timer->>SaveManager: autoSave(saveId, gameData)
        SaveManager->>LocalStorage: setItem()
    end
```

## 状態遷移図

### 1. ゲーム全体の状態遷移
```mermaid
stateDiagram-v2
    [*] --> SaveSelect: アプリ起動
    
    SaveSelect --> Loading: セーブ選択
    SaveSelect --> NewGame: 新規作成
    
    NewGame --> Loading: 初期化完了
    Loading --> Menu: ロード完了
    
    Menu --> Playing: ゲーム開始
    Playing --> Paused: 一時停止
    Paused --> Playing: 再開
    
    Playing --> WaveComplete: Wave クリア
    WaveComplete --> GachaResult: ガチャ実行
    GachaResult --> Playing: 次Wave準備
    
    Playing --> GameOver: 残機0
    Playing --> Victory: 全国制覇
    
    GameOver --> SaveSelect: タイトルへ
    Victory --> SaveSelect: タイトルへ
    
    state Playing {
        [*] --> WaveCountdown
        WaveCountdown --> WaveActive: カウント終了
        WaveActive --> WaveCountdown: Wave終了
    }
```

### 2. Wave状態遷移
```mermaid
stateDiagram-v2
    [*] --> Countdown: Wave開始
    
    Countdown --> SpawningEnemies: カウント0
    Countdown --> SpawningEnemies: スキップボタン
    
    SpawningEnemies --> ActiveCombat: 生成完了
    
    ActiveCombat --> CheckComplete: 敵撃破
    CheckComplete --> ActiveCombat: 敵残存
    CheckComplete --> WaveCleared: 全敵撃破
    
    ActiveCombat --> BaseDestroyed: HP0
    BaseDestroyed --> LivesCheck: 残機確認
    
    LivesCheck --> Respawn: 残機あり
    LivesCheck --> GameOver: 残機なし
    
    Respawn --> Countdown: 復活
    WaveCleared --> GachaTime: 報酬
    
    GachaTime --> [*]: 次Wave
```

### 3. タワー状態遷移
```mermaid
stateDiagram-v2
    [*] --> Idle: 配置
    
    Idle --> Searching: 敵出現
    Searching --> Targeting: 敵発見
    Searching --> Idle: 敵なし
    
    Targeting --> Attacking: 射程内
    Targeting --> Searching: 射程外
    
    Attacking --> Cooldown: 攻撃実行
    Cooldown --> Searching: クールダウン終了
    
    state Attacking {
        [*] --> CalculateDamage
        CalculateDamage --> ApplyEffects
        ApplyEffects --> DrawEffect
        DrawEffect --> [*]
    }
```

### 4. 敵状態遷移
```mermaid
stateDiagram-v2
    [*] --> Spawning: 生成
    
    Spawning --> Moving: 配置完了
    
    Moving --> Moving: 移動中
    Moving --> Damaged: 被弾
    Moving --> ReachedBase: 基地到達
    
    Damaged --> Moving: HP残存
    Damaged --> Defeated: HP0
    
    Defeated --> DropReward: 撃破
    DropReward --> [*]: 削除
    
    ReachedBase --> DamageBase: ダメージ
    DamageBase --> [*]: 削除
    
    state Moving {
        [*] --> CalculatePath
        CalculatePath --> UpdatePosition
        UpdatePosition --> CheckCollision
        CheckCollision --> [*]
    }
```

## イベントフロー

### ユーザー操作イベント
1. **セーブ選択** → Game初期化
2. **国旗選択** → 配置モード
3. **キャンバスクリック** → タワー配置/選択
4. **アップグレード購入** → タワー強化
5. **Wave開始** → 戦闘開始
6. **一時停止** → ゲーム停止

### システムイベント
1. **Wave完了** → ガチャ → 次Wave準備
2. **基地破壊** → 残機確認 → 復活/ゲームオーバー
3. **オートセーブ** → LocalStorage更新
4. **全国制覇** → エンディング