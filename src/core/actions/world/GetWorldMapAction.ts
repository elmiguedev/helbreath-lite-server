import { WorldMap } from "../../domain/entities/WorldMap";
import { WorldMapRepository } from "../../domain/respositories/WorldMapRepository";
import { Action } from "../Action";

export class GetWorldMapAction implements Action<string, WorldMap | undefined> {
  constructor(private readonly worldMapRepository: WorldMapRepository) { }
  public execute(id: string): WorldMap | undefined {
    return this.worldMapRepository.getById(id);
  }
}