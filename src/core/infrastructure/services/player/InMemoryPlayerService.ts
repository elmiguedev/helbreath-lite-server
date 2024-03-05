import { Position } from "../../../domain/entities/generic/Position";
import { Player } from "../../../domain/entities/player/Player";
import { WorldMap } from "../../../domain/entities/world/WorldMap";
import { MonsterRepository } from "../../../domain/repositories/monster/MonsterRepository";
import { PlayerRepository } from "../../../domain/repositories/player/PlayerRepository";
import { WorldMapRepository } from "../../../domain/repositories/worldmap/WorldMapRepository";
import { PlayerService } from "../../../domain/services/player/PlayerService";
import { MAX_PLAYER_SPEED } from "../../../utils/Constants";
import { MathUtils } from "../../../utils/MathUtils";
import { ServiceListener } from "../../../utils/ServiceListener";
import { WorldMapChange } from "../../../domain/entities/world/WorldMapChange";

export class InMemoryPlayerService implements PlayerService {
  private playerAttackListeners: ServiceListener<string>[] = [];
  private playerChangeMapListeners: ServiceListener<WorldMapChange[]>[] = [];

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

}