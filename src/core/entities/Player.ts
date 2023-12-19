import { MathUtils } from "../utils/MathUtils";
import { Position } from "./Position";

export class Player {
  private id: string;
  private name: string;
  private position: Position;
  private target?: Position;

  constructor(id: string) {
    this.id = id;
    this.name = id;
    this.position = {
      x: MathUtils.getRandomBetween(0, 800),
      y: MathUtils.getRandomBetween(0, 600)
    }
  }

  public setPosition(position: Position) {
    this.position = position;
  }

  public setTarget(position: Position) {
    this.target = position;
  }

  public getPosition() {
    return this.position;
  }

  public getId() {
    return this.id;
  }

  public getState() {
    return {
      id: this.id,
      name: this.name,
      position: this.position
    }
  }

  public updatePosition() {
    if (this.target) {
      const x = MathUtils.lerp(this.position.x, this.target.x, 0.1);
      const y = MathUtils.lerp(this.position.y, this.target.y, 0.1);
      this.setPosition({ x, y });
    }
  }
}