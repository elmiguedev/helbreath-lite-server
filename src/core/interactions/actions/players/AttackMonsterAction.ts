import { PlayerRepository } from "../../../domain/repositories/PlayerRepository";
import { GameService } from "../../../domain/services/GameService";
import { PLAYER_MIN_ATTACK_DISTANCE } from "../../../utils/Constants";
import { MathUtils } from "../../../utils/MathUtils";
import { Action } from "../Action";

export interface AttackMonsterActionParams {
  playerId: string;
  targetId: string;
}

export class AttackMonsterAction implements Action<AttackMonsterActionParams, void> {
  constructor(
    private readonly gameService: GameService,
  ) { }

  public execute(params: AttackMonsterActionParams): void {
    const player = this.gameService.getPlayer(params.playerId);
    const monster = this.gameService.getMonster(params.targetId);

    if (player && monster) {
      // 1. get distance between monster and player to check if it can attack
      const distance = MathUtils.getDistanceBetween(player.position, monster.position);
      if (distance > PLAYER_MIN_ATTACK_DISTANCE) return;

      // 2. calculate damage
      monster.health -= 10 // TODO: change hit and damage logic
      if (monster.health <= 0) {
        this.gameService.killMonster(monster.id);
      }

      this.gameService.attack(player.id);
    }
  }

}