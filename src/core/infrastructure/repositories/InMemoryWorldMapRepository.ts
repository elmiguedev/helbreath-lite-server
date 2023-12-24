import { WorldMap } from "../../domain/entities/WorldMap";
import { WorldMapRepository } from "../../domain/respositories/WorldMapRepository";
import { TiledMap, TiledMapLayer } from "../../utils/TiledMap";
import MapJson from "../data/maps.json";

export class InMemoryWorldMapRepository implements WorldMapRepository {
  private tiledMaps: TiledMap;
  private worldMaps: Map<string, WorldMap>;

  constructor() {
    this.worldMaps = new Map();
    this.tiledMaps = new TiledMap(MapJson);
    this.createWorldMaps();
  }

  private createWorldMaps() {
    const layers = this.tiledMaps.getGroupLayers();
    layers.forEach(layer => {
      const worldMap = new WorldMap({
        id: layer.name,
        name: layer.name,
      }, layer);
      this.worldMaps.set(worldMap.id, worldMap);
    });
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
      return worldMapLayer.getLayer("solid");
    }
  }



}