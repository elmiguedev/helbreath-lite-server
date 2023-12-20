import { Player } from "../../domain/entities/Player";
import { PlayerRepository } from "../../domain/respositories/PlayerRepository";
import { Action } from "../Action";

export class GetPlayersByWorldMapAction implements Action<string, Player[]> {
  constructor(private readonly playerRepository: PlayerRepository) { }

  public execute(worldMapId: string): Player[] {
    return this.playerRepository.getPlayersByWorldMap(worldMapId);
  }
}