import { Monster } from "../../../domain/entities/monster/Monster";
import { MonsterRepository } from "../../../domain/repositories/monster/MonsterRepository";

export class InMemoryMonsterRepository implements MonsterRepository {

  private map = new Map<string, Monster>();

  public add(monster: Monster): void {
    this.map.set(monster.id, monster);
  }

  public remove(id: string): Monster | undefined {
    const monster = this.map.get(id);
    if (monster) {
      this.map.delete(id);
      return monster;
    }
  }

  public getById(id: string): Monster | undefined {
    return this.map.get(id);
  }

  public getAll(): Monster[] {
    return Array.from(this.map.values());
  }

  public update(monster: Monster): void {
    this.map.set(monster.id, monster);
  }

  public getByWorldMap(worldMapId: string): Monster[] {
    return this.getAll().filter(monster => monster.worldMapId === worldMapId);
  }
}