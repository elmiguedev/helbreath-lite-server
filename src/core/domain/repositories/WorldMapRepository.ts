import { TiledMap, TiledMapLayer } from "../../utils/TiledMap";
import { WorldMap } from "../entities/WorldMap";

export interface WorldMapRepository {
  addMap(worldMap: WorldMap): void;
  getAll(): WorldMap[];
  getById(id: string): WorldMap | undefined;
  getSolidLayerById(id: string): TiledMapLayer | undefined;
}