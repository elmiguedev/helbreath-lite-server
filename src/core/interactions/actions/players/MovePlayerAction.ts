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
      // player.target = position;
      player.body!.applyImpulse(
        [1000, 1000],
        [position.x, position.y]
      )
      player.body!.ccdIterations = 10;
      player.body!.velocity[0] = 10;
      player.body!.velocity[1] = 10;
      // this.playerRepository.updatePlayer(player);
    }

  }
}