import { PlayerService } from "../../../domain/services/player/PlayerService";
import { Action } from "../Action";

export interface RemovePlayerActionParams {
  id: string;
}

export class RemovePlayerAction implements Action<RemovePlayerActionParams, void> {

  constructor(
    private readonly playerService: PlayerService
  ) { }

  public execute(params: RemovePlayerActionParams): void {
    this.playerService.removePlayer(params.id)
  }
}