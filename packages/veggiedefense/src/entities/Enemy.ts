import { Position } from './Tower';
import { Enemy as EnemyData } from '../data/vegetables';

export class Enemy {
  public position: Position;
  public data: EnemyData;
  public currentHealth: number;
  public maxHealth: number;
  public pathIndex: number = 0;
  public path: Position[];
  public slowedUntil: number = 0;
  public burnDamage: number = 0;
  public burnUntil: number = 0;

  constructor(data: EnemyData, path: Position[]) {
    this.data = data;
    this.currentHealth = data.health;
    this.maxHealth = data.health;
    this.path = path;
    this.position = { ...path[0] };
  }

  get speed(): number {
    const currentTime = Date.now();
    const speedMultiplier = currentTime < this.slowedUntil ? 0.5 : 1;
    return this.data.speed * speedMultiplier;
  }

  takeDamage(damage: number): void {
    this.currentHealth -= damage;
    if (this.currentHealth < 0) {
      this.currentHealth = 0;
    }
  }

  applyBurn(damage: number, duration: number): void {
    const currentTime = Date.now();
    this.burnDamage = damage;
    this.burnUntil = currentTime + duration;
  }

  applySlow(duration: number): void {
    const currentTime = Date.now();
    this.slowedUntil = Math.max(this.slowedUntil, currentTime + duration);
  }

  update(deltaTime: number): boolean {
    const currentTime = Date.now();
    
    // Apply burn damage
    if (currentTime < this.burnUntil) {
      this.takeDamage(this.burnDamage * deltaTime / 1000);
    }

    // Move along path
    if (this.pathIndex < this.path.length - 1) {
      const target = this.path[this.pathIndex + 1];
      const dx = target.x - this.position.x;
      const dy = target.y - this.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 2) {
        this.pathIndex++;
        if (this.pathIndex >= this.path.length - 1) {
          return true; // Reached end
        }
      } else {
        const moveDistance = this.speed * deltaTime / 1000;
        this.position.x += (dx / distance) * moveDistance;
        this.position.y += (dy / distance) * moveDistance;
      }
    }
    
    return false;
  }

  isAlive(): boolean {
    return this.currentHealth > 0;
  }

  getHealthPercentage(): number {
    return this.currentHealth / this.maxHealth;
  }
}