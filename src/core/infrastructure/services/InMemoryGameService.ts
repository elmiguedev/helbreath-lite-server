import { Player } from "../../domain/entities/Player";
import { Position } from "../../domain/entities/Position";

import { WorldMap } from "../../domain/entities/WorldMap";
import { WorldMapChange } from "../../domain/entities/WorldMapChange";
import { WorldStatus } from "../../domain/entities/WorldStatus";
import { PlayerRepository } from "../../domain/respositories/PlayerRepository";
import { WorldMapRepository } from "../../domain/respositories/WorldMapRepository";
import { GameService } from "../../domain/services/GameService";
import { GameServiceListener } from "../../domain/services/GameServiceListener";
import { GAME_LOOP_INTERVAL, PLAYER_MAX_SPEED } from "../../utils/Constants";
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
    const worldMaps = this.getWorldMaps();
    worldMaps.forEach(worldMap => {
      this.gameLoopTimers[worldMap.id] = setInterval(() => {

        // updateamos posiciones
        this.updatePlayersPositions(worldMap);

        // actualiza el estado de cada sala
        this.notifyWorldTickListeners(worldMap);

      }, GAME_LOOP_INTERVAL);
    });
  }

  private getWorldMaps() {
    return this.worldMapRepository.getAll();
  }

  // players positions

  private updatePlayersPositions(worldMap: WorldMap) { // TODO: cambiar nombre por solo update
    const players = this.playerRepository.getPlayersByWorldMap(worldMap.id);
    players.forEach(player => {

      // update player movement
      if (player.target) {
        this.updatePlayerPositionLinealStartegy(player, worldMap);
        this.playerRepository.updatePlayer(player);
      }

      // check portal
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
    });
  }

  private updatePlayerPositionLerpStrategy(player: Player, worldMap: WorldMap): void {
    if (player.target) {
      const x = MathUtils.lerp(player.position.x, player.target.x, 1);
      const y = MathUtils.lerp(player.position.y, player.target.y, 1);
      player.position = { x, y };
    }
  }

  private updatePlayerPositionLinealStartegy(player: Player, worldMap: WorldMap): void {
    if (player.target) {
      const distance = Math.sqrt(Math.pow(player.target.x - player.position.x, 2) + Math.pow(player.target.y - player.position.y, 2));
      if (distance <= PLAYER_MAX_SPEED) {
        player.position = player.target;
        player.target = undefined;
      } else {

        const newPosition = MathUtils.constantLerp(player.position.x, player.position.y, player.target.x, player.target.y, PLAYER_MAX_SPEED);
        const x = newPosition.x;
        const y = newPosition.y;


        let finalX = x;
        let finalY = y;

        const isLeftColliding = this.isLeftColliding({ x, y }, player, worldMap);
        const isRightColliding = this.isRightColliding({ x, y }, player, worldMap);
        const isBottomColliding = this.isBottomColliding({ x, y }, player, worldMap);
        const isTopColliding = this.isTopColliding({ x, y }, player, worldMap);

        if (isLeftColliding && x < player.position.x) {
          console.log("controlo left")
          finalX = player.position.x;
        }

        if (isRightColliding && x > player.position.x) {
          console.log("controlo right")
          finalX = player.position.x;
        }

        if (isTopColliding && y < player.position.y) {
          console.log("controlo top")
          finalY = player.position.y;
        }

        if (isBottomColliding && y > player.position.y) {
          console.log("controlo bottom")
          finalY = player.position.y;
        }

        player.position = { x: finalX, y: finalY };
      }
    }
  }

  private isTopColliding(newPosition: Position, player: Player, worldMap: WorldMap): boolean {
    for (let i = 0; i < player.bounds.width; i++) {
      const pixelX = (newPosition.x - player.bounds.width / 2) + i;
      const pixelY = newPosition.y - PLAYER_MAX_SPEED - player.bounds.height / 2;
      if (worldMap.isSolidPosition({ x: pixelX, y: pixelY })) {
        return true;
      }
    }
    return false;
  }

  private isBottomColliding(newPosition: Position, player: Player, worldMap: WorldMap): boolean {
    for (let i = 0; i < player.bounds.width; i++) {
      const pixelX = (newPosition.x - player.bounds.width / 2) + i;
      const pixelY = newPosition.y + PLAYER_MAX_SPEED + player.bounds.height / 2;
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
      const pixelX = (newPosition.x - PLAYER_MAX_SPEED - player.bounds.width / 2);
      const pixelY = (newPosition.y - player.bounds.height / 2) + i;
      if (worldMap.isSolidPosition({ x: pixelX, y: pixelY })) {
        return true;
      }
    }
    return false;
  }

  private isRightColliding(newPosition: Position, player: Player, worldMap: WorldMap): boolean {
    for (let i = 0; i < player.bounds.width; i++) {
      const pixelX = (newPosition.x + PLAYER_MAX_SPEED + player.bounds.width / 2);
      const pixelY = (newPosition.y - player.bounds.height / 2) + i;
      if (worldMap.isSolidPosition({ x: pixelX, y: pixelY })) {
        return true;
      }
    }

    return false;
  }



  // portals collisions

  // private checkPortalsCollisions(worldMap: WorldMap) {

  //   const portals = worldMap.portals || [];
  //   const players = this.playerRepository.getPlayersByWorldMap(worldMap.id);
  //   const changes: WorldMapChange[] = [];

  //   for (let i = 0; i < players.length; i++) {
  //     const player = players[i];

  //     for (let p = 0; p < portals.length; p++) {
  //       const portal = portals[p];
  //       if (this.isInPortal(portal, player)) {
  //         player.worldMapId = portal.targetWorldMapId;
  //         player.position = portal.targetPosition;
  //         player.target = portal.targetPosition;
  //         this.playerRepository.updatePlayer(player);

  //         changes.push({
  //           playerId: player.id,
  //           fromWorldMapId: worldMap.id,
  //           toWorldMapId: portal.targetWorldMapId,
  //         });
  //         break;
  //       }
  //     }

  //   }

  //   // Aca iria un notify para reemplazar lo de abajo
  //   this.notifyPortalCollisionListeners(changes);
  // }

  // private isInPortal(portal: Portal, player: Player): boolean {
  //   return (
  //     player.position.x > portal.position.x &&
  //     player.position.y > portal.position.y &&
  //     player.position.x < portal.position.x + portal.size.width &&
  //     player.position.y < portal.position.y + portal.size.height
  //   );
  // }

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