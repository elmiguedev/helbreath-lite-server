import { Position } from "../../../domain/entities/generic/Position";
import { GameService } from "../../../domain/services/GameService";
import { Action } from "../Action";

export interface MovePlayerActionParams {
  id: string;
  position: Position;
}

export class MovePlayerAction implements Action<MovePlayerActionParams, void> {
  constructor(private readonly gameService: GameService) { }

  public execute(params: MovePlayerActionParams): void {
    const { id, position } = params;
    const player = this.gameService.getPlayer(id);
    if (player) {
      player.target = position;
    }
  }
}