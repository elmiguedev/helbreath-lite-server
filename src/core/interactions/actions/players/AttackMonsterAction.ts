import { MonsterService } from "../../../domain/services/monster/MonsterService";
import { PlayerService } from "../../../domain/services/player/PlayerService";
import { PLAYER_MIN_ATTACK_DISTANCE } from "../../../utils/Constants";
import { MathUtils } from "../../../utils/MathUtils";
import { Action } from "../Action";

export interface AttackMonsterActionParams {
  playerId: string;
  targetId: string;
}

export class AttackMonsterAction implements Action<AttackMonsterActionParams, void> {
  constructor(
    private readonly playerService: PlayerService,
    private readonly monsterService: MonsterService,
  ) { }

  public execute(params: AttackMonsterActionParams): void {
    const player = this.playerService.getPlayer(params.playerId);
    const monster = this.monsterService.getMonster(params.targetId);

    if (player && monster) {

      // 1. get distance between monster and player to check if it can attack
      const distance = MathUtils.getDistanceBetween(player.position, monster.position);
      if (distance > PLAYER_MIN_ATTACK_DISTANCE) return;

      // 2. calculate attack hit
      const playerHitRatio = this.playerService.getPlayerHitRatio(player);
      const monsterDefenseRatio = monster.stats.defenseRatio;
      const isAttackSuccess = this.playerService.isAttackSuccess(playerHitRatio, monsterDefenseRatio);

      if (isAttackSuccess) {
        console.log("Player Pega!")
        console.log("Player hit ratio: ", playerHitRatio);
        console.log("Monster defense ratio: ", monsterDefenseRatio);

        const damage = this.playerService.getPlayerDamage(player, monster.stats.physicalAbsortion);
        console.log("Final damage: ", damage);

        monster.stats.health -= damage
        console.log("Monster current HP: ", monster.stats.health);

        if (monster.stats.health <= 0) {
          this.monsterService.killMonster(monster.id);
        }

      } else {
        console.log("Player erra :(")
      }

      this.playerService.notifyPlayerAttack(player.id);
    }
  }

}