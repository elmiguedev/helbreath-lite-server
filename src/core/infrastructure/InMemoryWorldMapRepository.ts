import { WorldMap } from "../domain/entities/WorldMap";
import { WorldMapRepository } from "../domain/respositories/WorldMapRepository";

export class InMemoryWorldMapRepository implements WorldMapRepository {
  private worldMaps: Map<string, WorldMap>;

  constructor() {
    this.worldMaps = new Map();
  }
  getAll(): WorldMap[] {
    return Array.from(this.worldMaps.values());
  }

  public addMap(worldMap: WorldMap): void {
    this.worldMaps.set(worldMap.id, worldMap);
  }

  public getById(id: string): WorldMap | undefined {
    return this.worldMaps.get(id);
  }

}