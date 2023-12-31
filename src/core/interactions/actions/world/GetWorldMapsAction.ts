import { WorldMap } from "../../../domain/entities/world/WorldMap";
import { WorldMapRepository } from "../../../domain/repositories/WorldMapRepository";
import { Action } from "../Action";

export class GetWorldMapsAction implements Action<string, WorldMap[]> {
  constructor(private readonly worldMapRepository: WorldMapRepository) { }
  public execute(): WorldMap[] {
    return this.worldMapRepository.getAll();
  }
}