import { PlayerRepository } from "../../../domain/repositories/PlayerRepository";
import { GameService } from "../../../domain/services/GameService";
import { Action } from "../Action";

export interface AttackPlayerActionParams {
  playerId: string;
  targetId: string;
}

export class AttackPlayerAction implements Action<AttackPlayerActionParams, void> {
  constructor(
    private readonly gameService: GameService,
  ) { }

  public execute(params: AttackPlayerActionParams): void {
    // TODO: this.gameService.attack(params.playerId, params.PlayerId);
  }

}