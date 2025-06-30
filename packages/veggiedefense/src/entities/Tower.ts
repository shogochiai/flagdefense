import { Vegetable } from '../data/vegetables';

export interface Position {
  x: number;
  y: number;
}

export class Tower {
  public position: Position;
  public vegetable: Vegetable;
  public level: number = 1;
  public lastAttackTime: number = 0;
  public abilityLastUsed: number = 0;
  public target: any = null;

  constructor(position: Position, vegetable: Vegetable) {
    this.position = position;
    this.vegetable = vegetable;
  }

  get attack(): number {
    return this.vegetable.attack * (1 + (this.level - 1) * 0.2);
  }

  get range(): number {
    return this.vegetable.range * (1 + (this.level - 1) * 0.1);
  }

  get attackSpeed(): number {
    return this.vegetable.attackSpeed * (1 + (this.level - 1) * 0.05);
  }

  canAttack(currentTime: number): boolean {
    return currentTime - this.lastAttackTime >= 1000 / this.attackSpeed;
  }

  performAttack(currentTime: number): void {
    this.lastAttackTime = currentTime;
  }

  canUseAbility(currentTime: number): boolean {
    if (!this.vegetable.ability) return false;
    return currentTime - this.abilityLastUsed >= this.vegetable.ability.cooldown * 1000;
  }

  useAbility(currentTime: number): void {
    if (this.vegetable.ability) {
      this.abilityLastUsed = currentTime;
    }
  }

  distanceTo(target: Position): number {
    const dx = target.x - this.position.x;
    const dy = target.y - this.position.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  isInRange(target: Position): boolean {
    return this.distanceTo(target) <= this.range;
  }

  upgrade(): void {
    if (this.level < 5) {
      this.level++;
    }
  }

  getUpgradeCost(): number {
    return Math.floor(this.vegetable.cost * 0.8 * this.level);
  }
}