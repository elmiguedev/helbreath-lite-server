import { Position } from "../../../domain/entities/generic/Position";
import { PlayerRepository } from "../../../domain/repositories/PlayerRepository";
import { Action } from "../Action";

export interface MovePlayerActionParams {
  id: string;
  position: Position;
}

export class MovePlayerAction implements Action<MovePlayerActionParams, void> {
  constructor(private readonly playerRepository: PlayerRepository) { }

  public execute(params: MovePlayerActionParams): void {
    const { id, position } = params;
    const player = this.playerRepository.getPlayer(id);
    if (player) {
      player.target = position;
      this.playerRepository.updatePlayer(player);
    }

  }
}