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
      // ------------------------
      // TODO: el skill en realidad es del armar que tiene equipada
      const playerHitRatio = player.attributes.dexterity >= 50
        ? player.skills.shortSword + (player.attributes.dexterity - 50) * 1.2
        : player.skills.shortSword;

      const monsterDefenseRatio = monster.stats.defenseRatio;

      const chanceToHit = (playerHitRatio / monsterDefenseRatio) * 0.5;
      const finalHitChange = Math.max(0.1, Math.min(0.9, chanceToHit));

      const attackThrow = Math.random();
      if (attackThrow <= finalHitChange) { // hacer el min y el max de la prob
        console.log("Player Pega!")
        console.log("Player hit ratio: ", playerHitRatio);
        console.log("Monster defense ratio: ", monsterDefenseRatio);
        console.log("PlayerChance to hit: ", finalHitChange);

        // Damage = weapon damage + str bonus (20% when str >= 100 or 40% if str >= 200)
        // Mock: using a Gladius sword
        const weaponDamage = 4;
        const strBonus = player.attributes.strength >= 100 ? weaponDamage * 0.2 : 0
        const damage = weaponDamage + strBonus

        console.log("Player weapon damage", weaponDamage)
        console.log("Player damage: ", damage);

        const finalDamage = damage - (damage * (monster.stats.physicalAbsortion / 100));
        monster.stats.health -= finalDamage;

        console.log("Final damage: ", finalDamage);

        monster.stats.health -= finalDamage
        console.log("Monster current HP: ", monster.stats.health);

        if (monster.stats.health <= 0) {
          this.gameService.killMonster(monster.id);
        }


      } else {
        console.log("Player erra :(")
      }

      // LA FORMA VIEJA:
      // --------------------
      // monster.stats.health -= 10 // TODO: change hit and damage logic
      // if (monster.stats.health <= 0) {
      //   this.gameService.killMonster(monster.id);
      // }

      this.gameService.attack(player.id);
    }
  }

}