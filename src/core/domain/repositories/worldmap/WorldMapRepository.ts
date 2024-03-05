import { WorldMap } from "../../entities/world/WorldMap";

export interface WorldMapRepository {
  addMap(worldMap: WorldMap): void;
  getAll(): WorldMap[];
  getById(id: string): WorldMap | undefined;
}