"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttackMonsterAction = void 0;
var Constants_1 = require("../../../utils/Constants");
var MathUtils_1 = require("../../../utils/MathUtils");
var AttackMonsterAction = /** @class */ (function () {
    function AttackMonsterAction(playerService, monsterService) {
        this.playerService = playerService;
        this.monsterService = monsterService;
    }
    AttackMonsterAction.prototype.execute = function (params) {
        var player = this.playerService.getPlayer(params.playerId);
        var monster = this.monsterService.getMonster(params.targetId);
        if (player && monster) {
            // 1. get distance between monster and player to check if it can attack
            var distance = MathUtils_1.MathUtils.getDistanceBetween(player.position, monster.position);
            if (distance > Constants_1.PLAYER_MIN_ATTACK_DISTANCE)
                return;
            // 2. calculate attack hit
            var playerHitRatio = this.playerService.getPlayerHitRatio(player);
            var monsterDefenseRatio = monster.stats.defenseRatio;
            var isAttackSuccess = this.playerService.isAttackSuccess(playerHitRatio, monsterDefenseRatio);
            if (isAttackSuccess) {
                console.log("Player Pega!");
                console.log("Player hit ratio: ", playerHitRatio);
                console.log("Monster defense ratio: ", monsterDefenseRatio);
                var damage = this.playerService.getPlayerDamage(player, monster.stats.physicalAbsortion);
                console.log("Final damage: ", damage);
                monster.stats.health -= damage;
                console.log("Monster current HP: ", monster.stats.health);
                if (monster.stats.health <= 0) {
                    var experience = this.monsterService.getMonsterExperience(monster);
                    this.playerService.addPlayerExperience(player.id, experience);
                    this.monsterService.killMonster(monster.id);
                    console.log();
                    console.log("CHAU MOSTRO!! ", player.stats);
                    console.log();
                }
            }
            else {
                console.log("Player erra :(");
            }
            this.playerService.notifyPlayerAttack(player.id);
        }
    };
    return AttackMonsterAction;
}());
exports.AttackMonsterAction = AttackMonsterAction;
