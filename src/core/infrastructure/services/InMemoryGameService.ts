import { Player } from "../../domain/entities/Player";
import { Position } from "../../domain/entities/Position";

import { WorldMap } from "../../domain/entities/WorldMap";
import { WorldMapChange } from "../../domain/entities/WorldMapChange";
import { WorldStatus } from "../../domain/entities/WorldStatus";
import { PlayerRepository } from "../../domain/repositories/PlayerRepository";
import { WorldMapRepository } from "../../domain/repositories/WorldMapRepository";
import { GameService } from "../../domain/services/GameService";
import { GameServiceListener } from "../../domain/services/GameServiceListener";
import { GAME_LOOP_INTERVAL, MAX_PLAYER_SPEED } from "../../utils/Constants";
import { MathUtils } from "../../utils/MathUtils";

export class InMemoryGameService implements GameService {
  private gameLoopTimers: Record<string, any>;
  private worldMapTickListeners: GameServiceListener[] = [];
  private portalCollisionListener: GameServiceListener[] = [];

  constructor(
    private readonly playerRepository: PlayerRepository,
    private readonly worldMapRepository: WorldMapRepository
  ) {
    this.gameLoopTimers = {};
  }

  public start() {
    this.worldMapRepository.getAll().forEach(worldMap => {
      this.gameLoopTimers[worldMap.id] = setInterval(() => {

        // updateamos posiciones
        this.updatePlayers(worldMap);

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
      this.playerRepository.updatePlayer(player);
    }
  }

  private isTopColliding(newPosition: Position, player: Player, worldMap: WorldMap): boolean {
    for (let i = 0; i < player.bounds.width; i++) {
      const pixelX = (newPosition.x - player.bounds.width / 2) + i;
      const pixelY = newPosition.y - MAX_PLAYER_SPEED - player.bounds.height / 2;
      if (worldMap.isSolidPosition({ x: pixelX, y: pixelY })) {
        return true;
      }
    }
    return false;
  }

  private isBottomColliding(newPosition: Position, player: Player, worldMap: WorldMap): boolean {
    for (let i = 0; i < player.bounds.width; i++) {
      const pixelX = (newPosition.x - player.bounds.width / 2) + i;
      const pixelY = newPosition.y + MAX_PLAYER_SPEED + player.bounds.height / 2;
      if (worldMap.isSolidPosition({ x: pixelX, y: pixelY })) {
        return true;
      }
    }
    return false;
  }

  private isLeftColliding(newPosition: Position, player: Player, worldMap: WorldMap): boolean {
    // NOTA: esto se puede optimizar solo validando los puntos extremos y no todo el bloque. PEEEERO, la 
    // una restriccion es que no puede existir un tile que sea mas chico que el ancho del hitbox del player:
    // o sea, el hitbox del player no puede ser mayor a un tile
    for (let i = 0; i < player.bounds.width; i++) {
      const pixelX = (newPosition.x - MAX_PLAYER_SPEED - player.bounds.width / 2);
      const pixelY = (newPosition.y - player.bounds.height / 2) + i;
      if (worldMap.isSolidPosition({ x: pixelX, y: pixelY })) {
        return true;
      }
    }
    return false;
  }

  private isRightColliding(newPosition: Position, player: Player, worldMap: WorldMap): boolean {
    for (let i = 0; i < player.bounds.width; i++) {
      const pixelX = (newPosition.x + MAX_PLAYER_SPEED + player.bounds.width / 2);
      const pixelY = (newPosition.y - player.bounds.height / 2) + i;
      if (worldMap.isSolidPosition({ x: pixelX, y: pixelY })) {
        return true;
      }
    }

    return false;
  }

  private getNewPlayerPosition(player: Player, worldMap: WorldMap): Position {
    if (!player.target) return player.position;

    const calculatedPosition = MathUtils.constantLerp(player.position.x, player.position.y, player.target.x, player.target.y, MAX_PLAYER_SPEED);
    const isLeftColliding = this.isLeftColliding(calculatedPosition, player, worldMap);
    const isRightColliding = this.isRightColliding(calculatedPosition, player, worldMap);
    const isBottomColliding = this.isBottomColliding(calculatedPosition, player, worldMap);
    const isTopColliding = this.isTopColliding(calculatedPosition, player, worldMap);

    const newPosition = calculatedPosition;

    if (isLeftColliding && calculatedPosition.x < player.position.x)
      newPosition.x = player.position.x;

    if (isRightColliding && calculatedPosition.x > player.position.x)
      newPosition.x = player.position.x;

    if (isTopColliding && calculatedPosition.y < player.position.y)
      newPosition.y = player.position.y;

    if (isBottomColliding && calculatedPosition.y > player.position.y)
      newPosition.y = player.position.y;

    return newPosition;
  }

  private checkPortalCollision(player: Player, worldMap: WorldMap) {
    const portal = worldMap.getPortalFromPosition(player.position);
    if (portal) {
      player.target = undefined;
      player.worldMapId = portal.targetWorldMapId;
      player.position = portal.targetPosition;
      this.playerRepository.updatePlayer(player);
      this.notifyPortalCollisionListeners([{
        fromWorldMapId: portal.worldMapId,
        toWorldMapId: portal.targetWorldMapId,
        playerId: player.id
      }]);
    }
  }

  // listeners
  private notifyWorldTickListeners(worldMap: WorldMap) {
    this.worldMapTickListeners.forEach(listener => {
      const worldStatus: WorldStatus = {
        world: worldMap.getStatus(),
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