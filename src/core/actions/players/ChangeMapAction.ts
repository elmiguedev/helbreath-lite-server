import { PlayerRepository } from "../../domain/respositories/PlayerRepository";
import { Action } from "../Action";

export interface ChangeMapActionParams {
  playerId: string;
  worldMapId: string;
}

export class ChangeMapAction implements Action<ChangeMapActionParams, void> {
  constructor(private readonly playerRepository: PlayerRepository) { }

  public execute(params: ChangeMapActionParams): void {
    const player = this.playerRepository.getPlayer(params.playerId);
    if (player) {
      player.worldMapId = params.worldMapId;
      this.playerRepository.updatePlayer(player);
    }
  }
}