import { Position } from "../../../domain/entities/generic/Position";
import { Player } from "../../../domain/entities/player/Player";
import { WorldMap } from "../../../domain/entities/world/WorldMap";
import { MonsterRepository } from "../../../domain/repositories/monster/MonsterRepository";
import { PlayerRepository } from "../../../domain/repositories/player/PlayerRepository";
import { WorldMapRepository } from "../../../domain/repositories/worldmap/WorldMapRepository";
import { PlayerService } from "../../../domain/services/player/PlayerService";
import { MAX_PLAYER_SPEED, PLAYER_CHANCE_TO_HIT_FACTOR, PLAYER_CHANCE_TO_HIT_MAX, PLAYER_CHANCE_TO_HIT_MIN, PLAYER_DAMAGE_BONUS_FACTOR, PLAYER_EXPERIENCE_ARRAY, PLAYER_HIT_RATIO_FACTOR, PLAYER_LEVEL_POINTS } from "../../../utils/Constants";
import { MathUtils } from "../../../utils/MathUtils";
import { ServiceListener } from "../../../utils/ServiceListener";
import { WorldMapChange } from "../../../domain/entities/world/WorldMapChange";
import { Monster } from "../../../domain/entities/monster/Monster";

export class InMemoryPlayerService implements PlayerService {
  private playerAttackListeners: ServiceListener<string>[] = [];
  private playerChangeMapListeners: ServiceListener<WorldMapChange[]>[] = [];
  private playerLevelUpListeners: ServiceListener<Player>[] = [];

  constructor(
    private readonly playerRepository: PlayerRepository,
    private readonly monsterRepository: MonsterRepository,
    private readonly worldMapRepository: WorldMapRepository
  ) { }


  public addPlayer(player: Player): void {
    const existing = this.playerRepository.getById(player.id);
    if (!existing) {
      this.playerRepository.add(player);
    }
  }

  public getPlayer(playerId: string): Player | undefined {
    return this.playerRepository.getById(playerId);
  }

  public removePlayer(playerId: string): void {
    this.playerRepository.remove(playerId);
  }

  public movePlayer(player: Player, worldMap: WorldMap): void {
    if (player.target) {
      const distance = MathUtils.getDistanceBetween(player.position, player.target);

      if (distance <= MAX_PLAYER_SPEED) {
        player.position = player.target;
        player.target = undefined;
        return;
      }

      player.position = this.getNewPlayerPosition(player, worldMap);
    }
  }

  public addPlayerAttackListener(listener: ServiceListener<string>): void {
    this.playerAttackListeners.push(listener);
  }

  public addPlayerChangeMapListener(listener: ServiceListener<WorldMapChange[]>): void {
    this.playerChangeMapListeners.push(listener);
  }

  public addLevelUpListener(listener: ServiceListener<Player>): void {
    this.playerLevelUpListeners.push(listener);
  }

  public notifyPlayerAttack(playerId: string): void {
    this.playerAttackListeners.forEach(listener => {
      listener.notify(playerId)
    })
  }

  public updatePlayersPosition(worldMap: WorldMap): void {
    const players = this.playerRepository.getByWorldMap(worldMap.id);
    players.forEach(player => {
      this.updatePlayerPosition(player, worldMap);
      this.checkPortalCollision(player, worldMap);
    });
  }

  public getPlayerHitRatio(player: Player): number {
    // TODO: el skill en realidad es del armar que tiene equipada
    return player.attributes.dexterity >= 50
      ? player.skills.shortSword + (player.attributes.dexterity - 50) * PLAYER_HIT_RATIO_FACTOR
      : player.skills.shortSword;
  }

  public isAttackSuccess(hitRatio: number, defenseRatio: number): boolean {
    const chanceToHit = (hitRatio / defenseRatio) * PLAYER_CHANCE_TO_HIT_FACTOR;
    const finalHitChange = MathUtils.fixProbability(
      chanceToHit,
      PLAYER_CHANCE_TO_HIT_MIN,
      PLAYER_CHANCE_TO_HIT_MAX
    )
    const attackThrow = Math.random();
    return attackThrow <= finalHitChange;
  }

  public getPlayerDamage(player: Player, enemyPhysicalAbsortion: number = 0): number {
    // Damage = weapon damage + str bonus (20% when str >= 100 or 40% if str >= 200)
    // Mock: using a Gladius sword
    const weaponDamage = 4;
    const strBonus = player.attributes.strength >= 100 ? weaponDamage * PLAYER_DAMAGE_BONUS_FACTOR : 0
    const damage = weaponDamage + strBonus

    console.log("Player weapon damage", weaponDamage)
    console.log("Player damage: ", damage);

    return damage - (damage * (enemyPhysicalAbsortion / 100));
  }

  public addPlayerExperience(playerId: string, experience: number): void {
    const player = this.playerRepository.getById(playerId);
    if (player) {
      let currentLevel = 0;
      player.stats.experience += experience;
      for (let level = 0; level < PLAYER_EXPERIENCE_ARRAY.length; level++) {
        const baseExperience = PLAYER_EXPERIENCE_ARRAY[level];
        if (player.stats.experience >= baseExperience) {
          currentLevel = level;
        } else {
          break;
        }
      }

      console.log("LA EXPERIENCIA QUE TENGO", player.stats.experience);
      console.log("EL NIVEL QUE ALCANZO EN EL ARRAY", currentLevel);
      console.log("EL NIVEL QUE TENGO YO", player.stats.level, " Y MIS FREE POINTS", player.stats.freeLevelPoints)

      if (currentLevel > player.stats.level) {
        player.stats.freeLevelPoints += (currentLevel - player.stats.level) * PLAYER_LEVEL_POINTS;
        player.stats.level = currentLevel;
        player.stats.baseLevelExperience = PLAYER_EXPERIENCE_ARRAY[currentLevel];
        player.stats.nextLevelExperience = PLAYER_EXPERIENCE_ARRAY[currentLevel + 1];
        this.notifyPlayerLevelUpListeners(player);
      }
    }
  }

  private updatePlayerPosition(player: Player, worldMap: WorldMap): void {
    if (player.target) {
      const distance = MathUtils.getDistanceBetween(player.position, player.target);

      if (distance <= MAX_PLAYER_SPEED) {
        player.position = player.target;
        player.target = undefined;
        return;
      }

      player.position = this.getNewPlayerPosition(player, worldMap);
    }
  }

  private getNewPlayerPosition(player: Player, worldMap: WorldMap): Position {
    if (!player.target) return player.position;

    const calculatedPosition = MathUtils.constantLerp(player.position.x, player.position.y, player.target.x, player.target.y, MAX_PLAYER_SPEED);
    const newPosition = calculatedPosition;

    for (let i = 0; i < worldMap.solids.length; i++) {
      const solidBlock = worldMap.solids[i];
      const xCalculated = MathUtils.constantLerp(player.position.x, player.position.y, player.target!.x, player.position.y, MAX_PLAYER_SPEED);
      if (MathUtils.isOverlapping(xCalculated, player.bounds, solidBlock.position, solidBlock.size)) {
        newPosition.x = player.position.x;
      } else {
        const yCalculated = MathUtils.constantLerp(player.position.x, player.position.y, player.position.x, player.target!.y, MAX_PLAYER_SPEED);
        if (MathUtils.isOverlapping(yCalculated, player.bounds, solidBlock.position, solidBlock.size)) {
          newPosition.y = player.position.y;
        }
      }
    }

    return newPosition;
  }

  private checkPortalCollision(player: Player, worldMap: WorldMap) {
    for (const portal of worldMap.portals) {
      if (MathUtils.isOverlapping(player.position, player.bounds, portal.position, portal.size)) {
        player.position = portal.target.position;
        player.target = undefined
        player.worldMapId = portal.target.worldMapId;
        this.notifyPlayerChangeMapListeners([{
          fromWorldMapId: portal.worldMapId,
          toWorldMapId: portal.target.worldMapId,
          playerId: player.id
        }]);
        return;
      }
    }
  }

  private notifyPlayerChangeMapListeners(changes: WorldMapChange[]) {
    this.playerChangeMapListeners.forEach(listener => {
      listener.notify(changes);
    });
  }

  private notifyPlayerLevelUpListeners(player: Player) {
    this.playerLevelUpListeners.forEach(listener => {
      listener.notify(player);
    });
  }

  private getLevelBaseExperience(level: number): number {
    if (level === 0) return 0;
    let xp = this.getLevelBaseExperience(level - 1) + level * (50 + (level * (level / 17) * (level / 17)));
    return xp;
  }

}