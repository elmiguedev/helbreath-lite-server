import { Player } from "../../domain/entities/player/Player";
import { PlayerRepository } from "../../domain/repositories/PlayerRepository";

export class InMemoryPlayerRepository implements PlayerRepository {

  private map = new Map<string, Player>();

  constructor() {
    this.map = new Map();
  }
  addPlayer(player: Player): void {
    this.map.set(player.id, player);
  }
  removePlayer(id: string): void {
    this.map.delete(id);
  }
  getPlayer(id: string): Player | undefined {
    return this.map.get(id);
  }
  getPlayers(): Player[] {
    return Array.from(this.map.values());
  }
  updatePlayer(player: Player): void {
    this.map.set(player.id, player);
  }

  getPlayersByWorldMap(worldMapId: string): Player[] {
    return this.getPlayers().filter(player => player.worldMapId === worldMapId);
  }
}