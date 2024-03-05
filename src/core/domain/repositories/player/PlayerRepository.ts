import { Player } from "../../entities/player/Player";

export interface PlayerRepository {
  add(player: Player): void;
  remove(id: string): void;
  getById(id: string): Player | undefined;
  getAll(): Player[];
  update(player: Player): void;
  getByWorldMap(worldMapId: string): Player[];
}