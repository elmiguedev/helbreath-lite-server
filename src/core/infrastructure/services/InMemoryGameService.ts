import { Player } from "../../domain/entities/player/Player";
import { Position } from "../../domain/entities/generic/Position";

import { WorldMap } from "../../domain/entities/world/WorldMap";
import { WorldMapChange } from "../../domain/entities/world/WorldMapChange";
import { WorldStatus } from "../../domain/entities/world/WorldStatus";
import { PlayerRepository } from "../../domain/repositories/PlayerRepository";
import { WorldMapRepository } from "../../domain/repositories/WorldMapRepository";
import { GameService } from "../../domain/services/GameService";
import { GameServiceListener } from "../../domain/services/GameServiceListener";
import { GAME_LOOP_INTERVAL, MAX_PLAYER_SPEED, PLAYER_MIN_ATTACK_DISTANCE } from "../../utils/Constants";
import { MathUtils } from "../../utils/MathUtils";
import { Monster } from "../../domain/entities/monster/Monster";

export class InMemoryGameService implements GameService {
  private gameLoopTimers: Record<string, any>;

  // entities
  private players: Record<string, Player>;
  private monsters: Record<string, Monster>;

  // listeners
  private worldStatusListener: GameServiceListener[] = [];
  private playerAttackListener: GameServiceListener[] = [];
  private playerChangeMapListener: GameServiceListener[] = [];
  private monsterKilledListener: GameServiceListener[] = [];


  constructor(
    private readonly playerRepository: PlayerRepository,
    private readonly worldMapRepository: WorldMapRepository,
  ) {
    this.gameLoopTimers = {};
    this.players = {};
    this.monsters = {};

    // TODO: borrar cuando se haga la funcionalidad de spawn
    setInterval(() => {
      if (Object.keys(this.monsters).length <= 6) {
        const monster: Monster = {
          id: MathUtils.getRandomId(),
          type: "dummy",
          damage: 1,
          defenseRatio: 1,
          health: 100,
          hitRatio: 1,
          name: "dummy",
          position: {
            x: MathUtils.getRandomBetween(600, 700),
            y: MathUtils.getRandomBetween(1000, 1100)
          },
          size: {
            width: 16,
            height: 16
          },
          worldMapId: "testMap"
        };

        this.monsters[monster.id] = monster;

      }
    }, 10000)
  }

  public start() {
    this.worldMapRepository.getAll().forEach(worldMap => {
      this.gameLoopTimers[worldMap.id] = setInterval(() => {

        // updateamos posiciones
        this.updatePlayers(worldMap);

        // actualiza el estado de cada sala
        this.notifyWorldStatus(worldMap);

      }, GAME_LOOP_INTERVAL);
    });
  }

  // players
  // --------------------------------------

  public addPlayer(player: Player): void {
    if (!this.players[player.id]) {
      this.players[player.id] = player;
    }
  }

  public getPlayer(playerId: string): Player | undefined {
    return this.players[playerId];
  }

  public removePlayer(playerId: string): void {
    delete this.players[playerId];
  }

  // monsters
  // --------------------------------------

  public addMonster(monster: Monster): void {
    if (!this.monsters[monster.id]) {
      this.monsters[monster.id] = monster;
    }
  }

  public getMonster(monsterId: string): Monster | undefined {
    return this.monsters[monsterId];
  }

  public removeMonster(monsterId: string): Monster | void {
    const monster = this.monsters[monsterId];
    if (monster) {
      delete this.monsters[monsterId];
      return monster;
    }
  }

  public killMonster(monsterId: string): void {
    const monster = this.removeMonster(monsterId);
    if (monster) {
      this.notifyMonsterKilled(monster)
    }
  }

  public attack(playerId: string) {
    this.notifyPlayerAttackListener(playerId);
  }

  private updatePlayers(worldMap: WorldMap) {
    const players = this.getPlayersByWorldMap(worldMap.id);
    players.forEach(player => {

      // update player movement
      this.updatePlayerPosition(player, worldMap);

      // check portal
      this.checkPortalCollision(player, worldMap);
    });
  }

  private getPlayersByWorldMap(worldMapId: string) {
    return Object.values(this.players).filter(player => player.worldMapId === worldMapId);
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

  // listeners
  public addWorldStatusListener(listener: GameServiceListener) {
    this.worldStatusListener.push(listener);
  }

  private notifyWorldStatus(worldMap: WorldMap) {
    this.worldStatusListener.forEach(listener => {
      const worldStatus: WorldStatus = {
        world: {
          id: worldMap.id,
          name: worldMap.name
        },
        players: Object.values(this.players),
        monsters: Object.values(this.monsters)
      }

      listener.notify(worldStatus);
    });
  }

  public addPlayerAttackListener(listener: GameServiceListener): void {
    this.playerAttackListener.push(listener);
  }

  public notifyPlayerAttackListener(playerId: string) {
    this.playerAttackListener.forEach(listener => {
      listener.notify(playerId);
    });
  }

  private notifyPlayerChangeMapListeners(changes: WorldMapChange[]) {
    this.playerChangeMapListener.forEach(listener => {
      listener.notify(changes);
    });
  }

  public addPlayerChangeMapListener(listener: GameServiceListener) {
    this.playerChangeMapListener.push(listener);
  }

  public addMonsterKilledListener(listener: GameServiceListener) {
    this.monsterKilledListener.push(listener);
  }

  public notifyMonsterKilled(monster: Monster) {
    this.monsterKilledListener.forEach(listener => {
      listener.notify(monster);
    });
  }



}