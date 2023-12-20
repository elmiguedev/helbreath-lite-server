import { WorldStatus } from "../../domain/entities/WorldStatus";
import { PlayerRepository } from "../../domain/respositories/PlayerRepository";
import { WorldMapRepository } from "../../domain/respositories/WorldMapRepository";
import { Action } from "../Action";

export class GetWorldStatusAction implements Action<string, WorldStatus> {
  constructor(
    private readonly worldMapRepository: WorldMapRepository,
    private readonly playerRepository: PlayerRepository

  ) { }

  public execute(worldMapId: string): WorldStatus {
    const worldMap = this.worldMapRepository.getById(worldMapId);
    if (!worldMap) {
      throw new Error("WorldMap not found");
    }
    return {
      world: worldMap,
      players: this.playerRepository.getPlayersByWorldMap(worldMapId)
    }
  }
}