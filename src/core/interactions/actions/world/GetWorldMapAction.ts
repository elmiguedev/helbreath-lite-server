import { WorldMap } from "../../../domain/entities/world/WorldMap";
import { WorldMapRepository } from "../../../domain/repositories/WorldMapRepository";
import { Action } from "../Action";

export class GetWorldMapAction implements Action<string, WorldMap | undefined> {
  constructor(private readonly worldMapRepository: WorldMapRepository) { }
  public execute(id: string): WorldMap | undefined {
    return this.worldMapRepository.getById(id);
  }
}