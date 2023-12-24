import { Player } from "../../domain/entities/Player";
import { Position } from "../../domain/entities/Position";

import { WorldMap } from "../../domain/entities/WorldMap";
import { WorldMapChange } from "../../domain/entities/WorldMapChange";
import { WorldStatus } from "../../domain/entities/WorldStatus";
import { PlayerRepository } from "../../domain/respositories/PlayerRepository";
import { WorldMapRepository } from "../../domain/respositories/WorldMapRepository";
import { GameService } from "../../domain/services/GameService";
import { GameServiceListener } from "../../domain/services/GameServiceListener";
import { GAME_LOOP_INTERVAL } from "../../utils/Constants";
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
      const x = MathUtils.lerp(player.position.x, player.target.x, 1, 10);
      const y = MathUtils.lerp(player.position.y, player.target.y, 1, 10);
      player.position = { x, y };
    }
  }

  private updatePlayerPositionLinealStartegy(player: Player, worldMap: WorldMap): void {
    if (player.target) {
      const MAX_SPEED = 4;
      const distance = Math.sqrt(Math.pow(player.target.x - player.position.x, 2) + Math.pow(player.target.y - player.position.y, 2));
      if (distance <= MAX_SPEED) {
        player.position = player.target;
        player.target = undefined;
      } else {

        // const cos = (player.target.x - player.position.x) / distance;
        // const sin = (player.target.y - player.position.y) / distance;
        // const max_x_speed = MAX_SPEED * cos;
        // const max_y_speed = MAX_SPEED * sin;
        // const x = player.position.x + max_x_speed;
        // const y = player.position.y + max_y_speed;

        const x = MathUtils.lerp(player.position.x, player.target.x, 0.01, 450);
        const y = MathUtils.lerp(player.position.y, player.target.y, 0.01, 450);

        // Logica para ver si esta colisionando o no
        // if top or bottom -> stop y, advance x
        // if left or right -> stop x, advance y

        // recorre todos los pixeles top
        // const collisions = this.getPlayerCollisionSide({ x, y }, player, worldMap);
        // const finalX = collisions.includes("top") || collisions.includes("bottom") ? player.position.x : x;
        // const finalY = collisions.includes("left") || collisions.includes("right") ? player.position.y : y;

        let finalX = x;
        let finalY = y;

        const isLeftColliding = this.isLeftColliding({ x, y }, player, worldMap);
        const isRightColliding = this.isRightColliding({ x, y }, player, worldMap);
        const isTopColliding = this.isTopColliding({ x, y }, player, worldMap);
        const isBottomColliding = this.isBottomColliding({ x, y }, player, worldMap);

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

        // if (worldMap.isSolidPosition({ x, y })) {
        //   player.position = { x: player.position.x, y: player.position.y };
        // } else {
        //   player.position = { x, y };
        // }

      }
    }
  }

  private isTopColliding(newPosition: Position, player: Player, worldMap: WorldMap): boolean {
    for (let i = 0; i < player.bounds.width; i++) {
      const pixelX = (newPosition.x - player.bounds.width / 2) + i;
      const pixelY = newPosition.y - 1 - player.bounds.height / 2;
      if (worldMap.isSolidPosition({ x: pixelX, y: pixelY })) {
        return true;
      }
    }
    return false;
  }

  private isBottomColliding(newPosition: Position, player: Player, worldMap: WorldMap): boolean {
    for (let i = 0; i < player.bounds.width; i++) {
      const pixelX = (newPosition.x - player.bounds.width / 2) + i;
      const pixelY = newPosition.y + 1 + player.bounds.height / 2;
      if (worldMap.isSolidPosition({ x: pixelX, y: pixelY })) {
        return true;
      }
    }
    return false;
  }

  private isLeftColliding(newPosition: Position, player: Player, worldMap: WorldMap): boolean {
    for (let i = 0; i < player.bounds.width; i++) {
      const pixelX = (newPosition.x - 1 - player.bounds.width / 2);
      const pixelY = (newPosition.y - player.bounds.height / 2) + i;
      if (worldMap.isSolidPosition({ x: pixelX, y: pixelY })) {
        return true;
      }
    }
    return false;
  }

  private isRightColliding(newPosition: Position, player: Player, worldMap: WorldMap): boolean {
    for (let i = 0; i < player.bounds.width; i++) {
      const pixelX = (newPosition.x + 1 + player.bounds.width / 2);
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