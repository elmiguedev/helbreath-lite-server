"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryPlayerService = void 0;
var Constants_1 = require("../../../utils/Constants");
var MathUtils_1 = require("../../../utils/MathUtils");
var InMemoryPlayerService = /** @class */ (function () {
    function InMemoryPlayerService(playerRepository, monsterRepository, worldMapRepository) {
        this.playerRepository = playerRepository;
        this.monsterRepository = monsterRepository;
        this.worldMapRepository = worldMapRepository;
        this.playerAttackListeners = [];
        this.playerChangeMapListeners = [];
    }
    InMemoryPlayerService.prototype.addPlayer = function (player) {
        var existing = this.playerRepository.getById(player.id);
        if (!existing) {
            this.playerRepository.add(player);
        }
    };
    InMemoryPlayerService.prototype.getPlayer = function (playerId) {
        return this.playerRepository.getById(playerId);
    };
    InMemoryPlayerService.prototype.removePlayer = function (playerId) {
        this.playerRepository.remove(playerId);
    };
    InMemoryPlayerService.prototype.movePlayer = function (player, worldMap) {
        if (player.target) {
            var distance = MathUtils_1.MathUtils.getDistanceBetween(player.position, player.target);
            if (distance <= Constants_1.MAX_PLAYER_SPEED) {
                player.position = player.target;
                player.target = undefined;
                return;
            }
            player.position = this.getNewPlayerPosition(player, worldMap);
        }
    };
    InMemoryPlayerService.prototype.addPlayerAttackListener = function (listener) {
        this.playerAttackListeners.push(listener);
    };
    InMemoryPlayerService.prototype.addPlayerChangeMapListener = function (listener) {
        this.playerChangeMapListeners.push(listener);
    };
    InMemoryPlayerService.prototype.notifyPlayerAttack = function (playerId) {
        this.playerAttackListeners.forEach(function (listener) {
            listener.notify(playerId);
        });
    };
    InMemoryPlayerService.prototype.updatePlayersPosition = function (worldMap) {
        var _this = this;
        var players = this.playerRepository.getByWorldMap(worldMap.id);
        players.forEach(function (player) {
            _this.updatePlayerPosition(player, worldMap);
            _this.checkPortalCollision(player, worldMap);
        });
    };
    InMemoryPlayerService.prototype.getPlayerHitRatio = function (player) {
        // TODO: el skill en realidad es del armar que tiene equipada
        return player.attributes.dexterity >= 50
            ? player.skills.shortSword + (player.attributes.dexterity - 50) * Constants_1.PLAYER_HIT_RATIO_FACTOR
            : player.skills.shortSword;
    };
    InMemoryPlayerService.prototype.isAttackSuccess = function (hitRatio, defenseRatio) {
        var chanceToHit = (hitRatio / defenseRatio) * Constants_1.PLAYER_CHANCE_TO_HIT_FACTOR;
        var finalHitChange = MathUtils_1.MathUtils.fixProbability(chanceToHit, Constants_1.PLAYER_CHANCE_TO_HIT_MIN, Constants_1.PLAYER_CHANCE_TO_HIT_MAX);
        var attackThrow = Math.random();
        return attackThrow <= finalHitChange;
    };
    InMemoryPlayerService.prototype.getPlayerDamage = function (player, enemyPhysicalAbsortion) {
        if (enemyPhysicalAbsortion === void 0) { enemyPhysicalAbsortion = 0; }
        // Damage = weapon damage + str bonus (20% when str >= 100 or 40% if str >= 200)
        // Mock: using a Gladius sword
        var weaponDamage = 4;
        var strBonus = player.attributes.strength >= 100 ? weaponDamage * Constants_1.PLAYER_DAMAGE_BONUS_FACTOR : 0;
        var damage = weaponDamage + strBonus;
        console.log("Player weapon damage", weaponDamage);
        console.log("Player damage: ", damage);
        return damage - (damage * (enemyPhysicalAbsortion / 100));
    };
    InMemoryPlayerService.prototype.addPlayerExperience = function (playerId, experience) {
        var player = this.playerRepository.getById(playerId);
        if (player) {
            var currentLevel = 0;
            player.stats.experience += experience;
            for (var level = 0; level < Constants_1.PLAYER_EXPERIENCE_ARRAY.length; level++) {
                var baseExperience = Constants_1.PLAYER_EXPERIENCE_ARRAY[level];
                if (player.stats.experience >= baseExperience) {
                    currentLevel = level;
                }
                else {
                    break;
                }
            }
            console.log("LA EXPERIENCIA QUE TENGO", player.stats.experience);
            console.log("EL NIVEL QUE ALCANZO EN EL ARRAY", currentLevel);
            console.log("EL NIVEL QUE TENGO YO", player.stats.level, " Y MIS FREE POINTS", player.stats.freeLevelPoints);
            if (currentLevel > player.stats.level) {
                player.stats.freeLevelPoints += (currentLevel - player.stats.level) * Constants_1.PLAYER_LEVEL_POINTS;
                player.stats.level = currentLevel;
            }
        }
    };
    InMemoryPlayerService.prototype.updatePlayerPosition = function (player, worldMap) {
        if (player.target) {
            var distance = MathUtils_1.MathUtils.getDistanceBetween(player.position, player.target);
            if (distance <= Constants_1.MAX_PLAYER_SPEED) {
                player.position = player.target;
                player.target = undefined;
                return;
            }
            player.position = this.getNewPlayerPosition(player, worldMap);
        }
    };
    InMemoryPlayerService.prototype.getNewPlayerPosition = function (player, worldMap) {
        if (!player.target)
            return player.position;
        var calculatedPosition = MathUtils_1.MathUtils.constantLerp(player.position.x, player.position.y, player.target.x, player.target.y, Constants_1.MAX_PLAYER_SPEED);
        var newPosition = calculatedPosition;
        for (var i = 0; i < worldMap.solids.length; i++) {
            var solidBlock = worldMap.solids[i];
            var xCalculated = MathUtils_1.MathUtils.constantLerp(player.position.x, player.position.y, player.target.x, player.position.y, Constants_1.MAX_PLAYER_SPEED);
            if (MathUtils_1.MathUtils.isOverlapping(xCalculated, player.bounds, solidBlock.position, solidBlock.size)) {
                newPosition.x = player.position.x;
            }
            else {
                var yCalculated = MathUtils_1.MathUtils.constantLerp(player.position.x, player.position.y, player.position.x, player.target.y, Constants_1.MAX_PLAYER_SPEED);
                if (MathUtils_1.MathUtils.isOverlapping(yCalculated, player.bounds, solidBlock.position, solidBlock.size)) {
                    newPosition.y = player.position.y;
                }
            }
        }
        return newPosition;
    };
    InMemoryPlayerService.prototype.checkPortalCollision = function (player, worldMap) {
        for (var _i = 0, _a = worldMap.portals; _i < _a.length; _i++) {
            var portal = _a[_i];
            if (MathUtils_1.MathUtils.isOverlapping(player.position, player.bounds, portal.position, portal.size)) {
                player.position = portal.target.position;
                player.target = undefined;
                player.worldMapId = portal.target.worldMapId;
                this.notifyPlayerChangeMapListeners([{
                        fromWorldMapId: portal.worldMapId,
                        toWorldMapId: portal.target.worldMapId,
                        playerId: player.id
                    }]);
                return;
            }
        }
    };
    InMemoryPlayerService.prototype.notifyPlayerChangeMapListeners = function (changes) {
        this.playerChangeMapListeners.forEach(function (listener) {
            listener.notify(changes);
        });
    };
    InMemoryPlayerService.prototype.getLevelBaseExperience = function (level) {
        if (level === 0)
            return 0;
        var xp = this.getLevelBaseExperience(level - 1) + level * (50 + (level * (level / 17) * (level / 17)));
        return xp;
    };
    return InMemoryPlayerService;
}());
exports.InMemoryPlayerService = InMemoryPlayerService;
