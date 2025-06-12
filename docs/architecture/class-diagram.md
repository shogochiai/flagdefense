# Flag Defence - クラス図

```mermaid
classDiagram
    %% Core Game Classes
    class Game {
        -enemies: GDPEnemy[]
        -towers: Tower[]
        -coins: number
        -wave: number
        -lives: number
        -ownedNations: string[]
        -gameModifiers: GameModifiers
        -specialEffects: SpecialEffects
        +startWave()
        +placeTower(x, y, nationId)
        +updateGame(deltaTime)
        +handleEnemyDefeat(enemy)
    }

    class Tower {
        +id: number
        +x: number
        +y: number
        +range: number
        +damage: number
        +lastShot: number
        +nationId: string
        +attack(enemies)
    }

    class GDPEnemy {
        +id: number
        +nation: NationData
        +x: number
        +y: number
        +hp: number
        +maxHp: number
        +speed: number
        +reward: number
        +pathProgress: number
        +type: EnemyType
        +takeDamage(amount)
        +getSize()
    }

    %% Nation System
    class NationData {
        +id: string
        +name: string
        +gdp: number
        +flag: string
        +colors: string[]
    }

    class NationAbility {
        +id: string
        +name: string
        +description: string
        +effects: AbilityEffect[]
    }

    class AbilityProcessor {
        +processAttack(towerNationId, damage, target, allEnemies)
        +getTowerModifiers(nationId)
        +getAbilityDescription(nationId)
    }

    %% Path System
    class PathSystem {
        -points: PathPoint[]
        -segments: Segment[]
        -totalLength: number
        +getPositionAtDistance(distance)
        +draw(ctx)
        +isOnPath(x, y)
    }

    %% Rendering System
    class FlagRenderer {
        -flagCache: FlagCache
        +preloadFlag(nationId)
        +drawFlag(ctx, nationId, x, y, width, height)
        -drawFallbackFlag(ctx, x, y, width, height, colors)
    }

    %% Shop System
    class ShopSystem {
        +items: ShopItem[]
        +purchasedItems: Record
        +handlePurchase(item)
    }

    class ShopItem {
        +id: string
        +name: string
        +description: string
        +cost: number
        +type: ItemType
        +maxPurchases: number
    }

    %% Save System
    class SaveSlotManager {
        +getAllSlots()
        +saveToSlot(slotId, data)
        +loadSlot(slotId)
        +deleteSlot(slotId)
    }

    class SaveData {
        +wave: number
        +coins: number
        +lives: number
        +towers: TowerData[]
        +ownedNations: string[]
        +powerups: Record
        +timestamp: number
    }

    %% Gacha System
    class SimpleGacha {
        +availableNations: Nation[]
        +pullGacha()
        +onNationPulled(nation)
    }

    %% Relationships
    Game --> Tower : manages
    Game --> GDPEnemy : manages
    Game --> PathSystem : uses
    Game --> SaveSlotManager : uses
    Game --> ShopSystem : contains
    
    Tower --> NationData : has
    Tower --> AbilityProcessor : uses
    
    GDPEnemy --> NationData : has
    GDPEnemy --> PathSystem : follows
    
    AbilityProcessor --> NationAbility : processes
    
    FlagRenderer --> NationData : renders
    
    ShopSystem --> ShopItem : contains
    
    SaveSlotManager --> SaveData : manages
    
    SimpleGacha --> NationData : pulls
```

## 主要クラスの説明

### Game
メインゲームクラス。全体のゲーム状態を管理し、ゲームループを制御します。

### Tower
タワークラス。配置位置、攻撃範囲、ダメージ、所属国家を持ちます。

### GDPEnemy
敵クラス。GDPベースのHP、速度、報酬を持ち、パスに沿って移動します。

### PathSystem
パスシステム。敵の移動経路を管理し、位置計算を行います。

### NationAbility & AbilityProcessor
国家別の特殊能力を定義し、攻撃時の処理を行います。

### FlagRenderer
国旗の描画を担当。画像のプリロードとフォールバック描画を管理します。

### ShopSystem
ショップ機能。パワーアップアイテムや残機の購入を管理します。

### SaveSlotManager
10個のセーブスロットを管理し、セーブ/ロード機能を提供します。

### SimpleGacha
ガチャシステム。ランダムに国家を獲得する機能を提供します。