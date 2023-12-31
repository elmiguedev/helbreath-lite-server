import { Player } from "../entities/player/Player";

export interface PlayerRepository {
  addPlayer(player: Player): void;
  removePlayer(id: string): void;
  getPlayer(id: string): Player | undefined;
  getPlayers(): Player[];
  updatePlayer(player: Player): void;
  getPlayersByWorldMap(worldMapId: string): Player[];
}