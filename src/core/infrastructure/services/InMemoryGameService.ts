import { Player } from "../../domain/entities/player/Player";
import { Position } from "../../domain/entities/generic/Position";

import { WorldMap } from "../../domain/entities/world/WorldMap";
import { WorldMapChange } from "../../domain/entities/world/WorldMapChange";
import { WorldStatus } from "../../domain/entities/world/WorldStatus";
import { PlayerRepository } from "../../domain/repositories/PlayerRepository";
import { WorldMapRepository } from "../../domain/repositories/WorldMapRepository";
import { GameService } from "../../domain/services/GameService";
import { GameServiceListener } from "../../domain/services/GameServiceListener";
import { GAME_LOOP_INTERVAL, MAX_PLAYER_SPEED } from "../../utils/Constants";
import { MathUtils, xor } from "../../utils/MathUtils";

import p2 from "p2";

export class InMemoryGameService implements GameService {
  private gameLoopTimers: Record<string, any>;
  private worldMapTickListeners: GameServiceListener[] = [];
  private portalCollisionListener: GameServiceListener[] = [];

  constructor(
    private readonly playerRepository: PlayerRepository,
    private readonly worldMapRepository: WorldMapRepository,
    private readonly world: p2.World
  ) {
    this.gameLoopTimers = {};
  }

  public start() {

    this.worldMapRepository.getAll().forEach(worldMap => {
      this.gameLoopTimers[worldMap.id] = setInterval(() => {

        // updateamos posiciones
        // this.updatePlayers(worldMap);

        this.world.step(GAME_LOOP_INTERVAL / 1000);
        // actualiza el estado de cada sala
        this.notifyWorldTickListeners(worldMap);

      }, GAME_LOOP_INTERVAL);
    });
  }

  private updatePlayers(worldMap: WorldMap) {
    const players = this.playerRepository.getPlayersByWorldMap(worldMap.id);
    players.forEach(player => {

      // update player movement
      this.updatePlayerPosition(player, worldMap);

      // check portal
      // this.checkPortalCollision(player, worldMap);
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
      this.playerRepository.updatePlayer(player);
    }
  }

  private getNewPlayerPosition(player: Player, worldMap: WorldMap): Position {
    if (!player.target) return player.position;

    const calculatedPosition = MathUtils.constantLerp(player.position.x, player.position.y, player.target.x, player.target.y, MAX_PLAYER_SPEED);
    const newPosition = calculatedPosition;

    for (let i = 0; i < worldMap.solids.length; i++) {
      const solidBlock = worldMap.solids[i];
      const overlapping = MathUtils.isOverlapping(newPosition, player.bounds, solidBlock.position, solidBlock.size);
      if (overlapping) {
        newPosition.x = player.position.x;
        newPosition.y = player.position.y;
        player.target = undefined;
      }
    }

    return newPosition;
  }

  // private checkPortalCollision(player: Player, worldMap: WorldMap) {
  //   const portal = worldMap.getPortalFromPosition(player.position);
  //   if (portal) {
  //     player.target = undefined;
  //     player.worldMapId = portal.targetWorldMapId;
  //     player.position = portal.targetPosition;
  //     this.playerRepository.updatePlayer(player);
  //     this.notifyPortalCollisionListeners([{
  //       fromWorldMapId: portal.worldMapId,
  //       toWorldMapId: portal.targetWorldMapId,
  //       playerId: player.id
  //     }]);
  //   }
  // }

  // listeners
  private notifyWorldTickListeners(worldMap: WorldMap) {
    this.worldMapTickListeners.forEach(listener => {
      const worldStatus: WorldStatus = {
        world: {
          id: worldMap.id,
          name: worldMap.name
        },
        players: this.playerRepository.getPlayersByWorldMap(worldMap.id),
      }
      listener.notify(worldStatus);
    });
  }

  private notifyPortalCollisionListeners(changes: WorldMapChange[]) {
    this.portalCollisionListener.forEach(listener => {
      listener.notify(changes);
    });
  }

  public addWorldMapTickListener(listener: GameServiceListener) {
    this.worldMapTickListeners.push(listener);
  }

  public addPortalCollisionListener(listener: GameServiceListener) {
    this.portalCollisionListener.push(listener);
  }

}