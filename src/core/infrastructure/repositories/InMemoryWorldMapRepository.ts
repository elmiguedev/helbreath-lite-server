import { WorldMap } from "../../domain/entities/WorldMap";
import { WorldMapRepository } from "../../domain/respositories/WorldMapRepository";
import { TiledMap, TiledMapLayer } from "../../utils/TiledMap";

import TestMapJson from "../../../../../helbreath-lite-client/src/assets/tilemaps/test/test.json";

export class InMemoryWorldMapRepository implements WorldMapRepository {
  private tiledMaps: TiledMap;
  private worldMaps: Map<string, WorldMap>;

  constructor() {
    this.worldMaps = new Map();
    this.tiledMaps = new TiledMap(TestMapJson);
    this.createWorldMaps();
  }

  private createWorldMaps() {
    // crea uno por uno los mapas
    const testMap = new WorldMap({
      id: "testMap",
      name: "testMap",
    }, new TiledMap(TestMapJson));

    this.worldMaps.set(testMap.id, testMap);
  }

  public getAll(): WorldMap[] {
    return Array.from(this.worldMaps.values());
  }

  public addMap(worldMap: WorldMap): void {
    this.worldMaps.set(worldMap.id, worldMap);
  }

  public getById(id: string): WorldMap | undefined {
    return this.worldMaps.get(id);
  }

  public getSolidLayerById(id: string): TiledMapLayer | undefined {
    const worldMapLayer = this.tiledMaps.getGroupLayer(id);
    if (worldMapLayer) {
      return worldMapLayer.getLayer("control");
    }
  }



}