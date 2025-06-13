# Flag Defence Game Design Specification v2.0.0

## Version History
- v1.0.0 - Initial game design with basic tower defense mechanics
- v2.0.0 - Enhanced nation abilities, meme elements, and advanced game mechanics

## Game Overview
Flag Defence is a tower defense game where players place country flags as defensive towers to protect their castle from waves of enemies. Each country has unique abilities based on their real-world characteristics, GDP, and cultural memes.

## Core Mechanics

### 1. Tower System
- **Tower Lifetime**: Each tower lasts for 2 waves before disappearing
- **Placement Cost**: Based on nation's GDP tier
- **Base Stats**: Damage, range, and attack speed scale with GDP

### 2. Enemy System (GDP-based)
- Enemy strength increases with wave progression
- Enemy types: Normal, Tank, Boss
- Rarity system: ★1 to ★5
- HP, speed, and rewards based on GDP values

### 3. Wave Progression
- 25-second time limit per wave
- Auto-acquire new nation after wave completion (gacha system)
- Can acquire nations up to current highest rarity + 1

## Nation Ability System v2.0

### Ability Types

#### Core Abilities (v1.0)
- `damage`: Damage multiplier
- `slow`: Speed reduction
- `splash`: Area damage
- `money`: Coin bonus
- `range`: Range increase
- `multi`: Multiple targets
- `pierce`: Penetrating attacks

#### New Abilities (v2.0)
- `chain`: Chain attacks on kill
- `laser`: Line damage to all enemies
- `freeze`: Complete immobilization
- `explosion`: Large area damage
- `buff`: Ally enhancement
- `debuff`: Enemy weakening
- `summon`: Create units
- `transform`: Change enemy properties

### Special Nation Categories

#### 1. Meme/Social Media Friendly Nations (Coin Focus)
These nations have coin-generation abilities to encourage strategic placement:

```typescript
nauru: {
  name: 'Mining',
  description: 'Coin gain +80%',
  tier: 1 // Early game advantage
}

vatican: {
  name: 'Holy Blessing',
  description: 'All towers coin +15% (2 waves)',
  special: 'global_buff'
}

luxembourg: {
  name: 'Financial Hub',
  description: 'Coin gain +100%'
}

monaco: {
  name: 'Casino',
  description: 'Coin gain 0-200% random'
}

san_marino: {
  name: 'Tourism',
  description: 'Passive coin generation over time'
}
```

#### 2. High GDP Nations (Late Game Power)
Powerful abilities for handling large groups of strong enemies:

```typescript
usa: {
  name: 'Air Strike',
  description: 'Splash damage +50%',
  tier: 6
}

china: {
  name: 'Human Wave',
  description: 'Attacks hit 3 enemies',
  tier: 6
}

russia: {
  name: 'General Winter',
  description: 'Freeze all enemies (2s)',
  tier: 5
}

saudi_arabia: {
  name: 'Oil Money',
  description: 'Explosion on hit, coin +50%',
  tier: 5
}

switzerland: {
  name: 'Precision Clock',
  description: 'Time stop (1.5s)',
  tier: 5
}
```

#### 3. Notorious Nations (Special Effects)
Nations with negative reputation get unique mechanics:

```typescript
greece: {
  name: 'Economic Crisis',
  description: 'Damage +100% but coin -50%',
  visualEffect: 'debt_counter'
}

venezuela: {
  name: 'Hyperinflation',
  description: 'Cost increases each second',
  visualEffect: 'rising_numbers'
}

zimbabwe: {
  name: '100 Trillion Dollar',
  description: 'Coin +1000% but lose 90% instantly',
  visualEffect: 'money_evaporation'
}

north_korea: {
  name: 'Mystery Tech',
  description: 'Random ability each attack',
  visualEffect: 'question_marks'
}
```

## Upgrade System
- Damage Boost: +10% per level
- Range Boost: +10% per level
- Attack Speed: +10% per level
- Coin Multiplier: +20% per level
- Special Effects: Slow Field, Double Coin, Shield

## Visual Design
- Futuristic space theme
- Neon path effects
- Real-time attack animations
- Kill notification system
- Rarity display for new acquisitions
- Special visual effects for notorious nations

## Economy Balance
- Early game: Focus on coin-generating nations (Nauru, Singapore)
- Mid game: Balance between offense and economy
- Late game: High GDP nations for crowd control
- Tower placement cost increases with GDP
- Constant need to manage tower replacement costs

## Save System
- 5 save slots
- Preserves: Current wave, nations owned, coins, upgrades
- Auto-save functionality

## Technical Implementation Notes

### Nation Data Structure
```typescript
interface Nation {
  id: string;
  name: string;
  gdp: number;
  flag: string;
  colors: string[];
  tier?: number;
  cost?: number;
  damage?: number;
  range?: number;
}
```

### Ability Effect Structure
```typescript
interface AbilityEffect {
  type: AbilityType;
  value: number;
  duration?: number;
  chance?: number;
  radius?: number;
  target?: 'enemy' | 'ally' | 'self' | 'global';
}
```

## Future Considerations
1. Multiplayer modes
2. Daily challenges with specific nation restrictions
3. Achievement system based on nation combinations
4. Seasonal events with themed abilities
5. Nation synergy bonuses

## Version 2.0.0 Summary
This version introduces:
- 8 new ability types for deeper strategy
- Meme-focused nations with coin generation
- Special effects for notorious nations
- Enhanced visual feedback system
- Balanced economy with strategic depth
- 250 total nations with unique characteristics