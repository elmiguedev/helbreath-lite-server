import { PlayerService } from "../../../domain/services/player/PlayerService";
import { Action } from "../Action";

export interface AttackPlayerActionParams {
  playerId: string;
  targetId: string;
}

export class AttackPlayerAction implements Action<AttackPlayerActionParams, void> {
  constructor(
    private readonly playerService: PlayerService,
  ) { }

  public execute(params: AttackPlayerActionParams): void {
    // TODO: this.gameService.attack(params.playerId, params.PlayerId);
  }

}