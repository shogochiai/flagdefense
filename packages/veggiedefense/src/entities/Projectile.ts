import { Position } from './Tower';
import { Enemy } from './Enemy';

export class Projectile {
  public position: Position;
  public target: Enemy;
  public damage: number;
  public speed: number;
  public color: string;
  public piercing: boolean = false;
  public aoe: boolean = false;
  public aoeRadius: number = 0;

  constructor(
    position: Position, 
    target: Enemy, 
    damage: number, 
    speed: number = 300,
    color: string = "#FFD700"
  ) {
    this.position = { ...position };
    this.target = target;
    this.damage = damage;
    this.speed = speed;
    this.color = color;
  }

  update(deltaTime: number): boolean {
    if (!this.target || !this.target.isAlive()) {
      return true; // Remove projectile
    }

    const dx = this.target.position.x - this.position.x;
    const dy = this.target.position.y - this.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 10) {
      // Hit target
      this.target.takeDamage(this.damage);
      return !this.piercing; // Remove if not piercing
    }

    // Move towards target
    const moveDistance = this.speed * deltaTime / 1000;
    this.position.x += (dx / distance) * moveDistance;
    this.position.y += (dy / distance) * moveDistance;

    return false;
  }
}