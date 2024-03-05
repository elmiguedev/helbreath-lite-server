import { Position } from "../../../domain/entities/generic/Position";
import { PlayerService } from "../../../domain/services/player/PlayerService";
import { Action } from "../Action";

export interface MovePlayerActionParams {
  id: string;
  position: Position;
}

export class MovePlayerAction implements Action<MovePlayerActionParams, void> {
  constructor(
    private readonly playerService: PlayerService
  ) { }

  public execute(params: MovePlayerActionParams): void {
    const { id, position } = params;
    const player = this.playerService.getPlayer(id);
    if (player) {
      player.target = position;
    }
  }
}