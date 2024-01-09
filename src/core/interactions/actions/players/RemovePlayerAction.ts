import { PlayerRepository } from "../../../domain/repositories/PlayerRepository";
import { GameService } from "../../../domain/services/GameService";
import { Action } from "../Action";

export interface RemovePlayerActionParams {
  id: string;
}

export class RemovePlayerAction implements Action<RemovePlayerActionParams, void> {

  constructor(private readonly gameService: GameService) { }

  public execute(params: RemovePlayerActionParams): void {
    this.gameService.removePlayer(params.id)
  }
}