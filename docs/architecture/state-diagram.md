# Flag Defence - 状態図

## 1. ゲーム全体の状態遷移

```mermaid
stateDiagram-v2
    [*] --> MainMenu
    MainMenu --> GamePlaying: ゲーム開始
    MainMenu --> LoadMenu: ロード選択
    
    LoadMenu --> GamePlaying: セーブデータ選択
    LoadMenu --> MainMenu: キャンセル
    
    GamePlaying --> WavePreparation: 初期状態
    
    WavePreparation --> WaveActive: Wave開始
    WavePreparation --> ShopOpen: ショップ開く
    WavePreparation --> SaveMenu: セーブ選択
    
    ShopOpen --> WavePreparation: ショップ閉じる
    SaveMenu --> WavePreparation: セーブ完了/キャンセル
    
    WaveActive --> WaveComplete: 25秒経過 & 敵全滅
    WaveActive --> WaveFailed: 25秒経過 & 敵残存
    WaveActive --> GameOver: 残機0
    
    WaveComplete --> GachaMode: ガチャ画面へ
    WaveFailed --> WavePreparation: 次Waveへ
    
    GachaMode --> WavePreparation: ガチャ終了
    
    GameOver --> MainMenu: リトライ
    GameOver --> [*]: 終了
```

## 2. Wave中の敵の状態遷移

```mermaid
stateDiagram-v2
    [*] --> Spawning: 生成
    Spawning --> Moving: パス上に配置
    
    Moving --> Slowed: スロー効果適用
    Slowed --> Moving: 効果時間終了
    
    Moving --> Damaged: 攻撃を受ける
    Slowed --> Damaged: 攻撃を受ける
    
    Damaged --> Moving: HP > 0
    Damaged --> Defeated: HP <= 0
    
    Moving --> ReachedBase: 基地到達
    
    Defeated --> [*]: 報酬付与
    ReachedBase --> [*]: ライフ減少
```

## 3. タワーの状態遷移

```mermaid
stateDiagram-v2
    [*] --> Placed: 配置
    
    Placed --> Idle: 初期状態
    
    Idle --> Searching: 敵探索
    Searching --> Targeting: 射程内に敵発見
    Searching --> Idle: 敵なし
    
    Targeting --> Attacking: 攻撃
    Attacking --> Cooldown: 攻撃完了
    
    Cooldown --> Idle: クールダウン終了
    
    state Attacking {
        [*] --> DamageCalculation
        DamageCalculation --> AbilityCheck
        AbilityCheck --> SingleTarget: 通常攻撃
        AbilityCheck --> MultiTarget: 範囲/複数攻撃
        AbilityCheck --> SpecialEffect: 特殊効果
        SingleTarget --> [*]
        MultiTarget --> [*]
        SpecialEffect --> [*]
    }
```

## 4. ショップアイテムの状態遷移

```mermaid
stateDiagram-v2
    [*] --> Available: 初期状態
    
    Available --> Purchasing: 購入ボタンクリック
    
    Purchasing --> CoinCheck: コイン確認
    CoinCheck --> Available: コイン不足
    CoinCheck --> Purchased: 購入成功
    
    Purchased --> Applied: 効果適用
    
    Applied --> Available: 再購入可能アイテム
    Applied --> MaxedOut: 最大購入数到達
    
    MaxedOut --> [*]: 購入不可
    
    state Applied {
        [*] --> PowerupApplied: パワーアップ
        [*] --> LivesAdded: 残機追加
        [*] --> SpecialActive: 特殊効果
        PowerupApplied --> [*]
        LivesAdded --> [*]
        SpecialActive --> [*]
    }
```

## 5. セーブスロットの状態遷移

```mermaid
stateDiagram-v2
    [*] --> Empty: 初期状態
    
    Empty --> Saving: セーブ実行
    Saving --> Occupied: セーブ完了
    
    Occupied --> Loading: ロード選択
    Occupied --> Overwriting: 上書き選択
    Occupied --> Deleting: 削除選択
    
    Loading --> GameRestored: ゲーム復元
    Overwriting --> Saving: 確認後セーブ
    Deleting --> Empty: 削除完了
    
    GameRestored --> [*]
    
    state Occupied {
        Wave: Wave情報
        Coins: コイン数
        Lives: 残機数
        Towers: タワー配置
        Nations: 所有国家
        Powerups: パワーアップ
    }
```

## 6. 特殊効果の状態遷移

```mermaid
stateDiagram-v2
    [*] --> Inactive: 初期状態
    
    Inactive --> Purchased: ショップで購入
    Purchased --> Active: Wave開始時に有効化
    
    state Active {
        [*] --> SlowField: スローフィールド
        [*] --> DoubleCoins: コイン2倍
        [*] --> Shield: シールド
        
        SlowField --> TimerRunning: 25秒間有効
        DoubleCoins --> TimerRunning: 25秒間有効
        Shield --> CounterActive: 3回有効
        
        TimerRunning --> Expired: 時間切れ
        CounterActive --> Expired: 回数消費
    }
    
    Active --> Expired: 効果終了
    Expired --> Inactive: リセット
```

## 状態管理の重要ポイント

1. **Wave状態管理**: 25秒のタイマーと敵の生存状態で判定
2. **敵の状態**: 移動中、スロー中、撃破の3つの主要状態
3. **タワーの状態**: アイドル、ターゲティング、攻撃、クールダウンのサイクル
4. **ショップアイテム**: 購入可能数の管理と効果の即時/持続判定
5. **セーブスロット**: 10個の独立したスロットの状態管理
6. **特殊効果**: Wave単位での有効/無効切り替え