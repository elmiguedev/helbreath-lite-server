import { Player } from "../../../domain/entities/player/Player";
import { PlayerRepository } from "../../../domain/repositories/player/PlayerRepository";

export class InMemoryPlayerRepository implements PlayerRepository {

  private map = new Map<string, Player>();

  constructor() {
    this.map = new Map();
  }
  add(player: Player): void {
    this.map.set(player.id, player);
  }
  remove(id: string): void {
    this.map.delete(id);
  }
  getById(id: string): Player | undefined {
    return this.map.get(id);
  }
  getAll(): Player[] {
    return Array.from(this.map.values());
  }
  update(player: Player): void {
    this.map.set(player.id, player);
  }

  getByWorldMap(worldMapId: string): Player[] {
    return this.getAll().filter(player => player.worldMapId === worldMapId);
  }
}