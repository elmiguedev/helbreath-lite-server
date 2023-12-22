import { Player } from "../../domain/entities/Player";
import { Portal } from "../../domain/entities/Portal";
import { WorldMap } from "../../domain/entities/WorldMap";
import { WorldMapChange } from "../../domain/entities/WorldMapChange";
import { WorldStatus } from "../../domain/entities/WorldStatus";
import { PlayerRepository } from "../../domain/respositories/PlayerRepository";
import { WorldMapRepository } from "../../domain/respositories/WorldMapRepository";
import { GameService } from "../../domain/services/GameService";
import { GameServiceListener } from "../../domain/services/GameServiceListener";
import { GAME_LOOP_INTERVAL } from "../../utils/Constants";

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

        // validamos colisiones con portales
        this.checkPortalsCollisions(worldMap);

        // actualiza el estado de cada sala
        this.notifyWorldTickListeners(worldMap);

      }, GAME_LOOP_INTERVAL);
    });
  }

  private getWorldMaps() {
    return this.worldMapRepository.getAll();
  }

  // players positions

  private updatePlayersPositions(worldMap: WorldMap) {
    const players = this.playerRepository.getPlayersByWorldMap(worldMap.id);
    players.forEach(player => {
      if (player.target) {
        this.updatePlayerPositionLinealStartegy(player);
        this.playerRepository.updatePlayer(player);
      }
    });
  }

  private updatePlayerPositionLinealStartegy(player: Player): void {
    if (player.target) {
      const MAX_SPEED = 4;
      const distance = Math.sqrt(Math.pow(player.target.x - player.position.x, 2) + Math.pow(player.target.y - player.position.y, 2));
      if (distance <= MAX_SPEED) {
        player.position = player.target;
        player.target = undefined;
      } else {

        const cos = (player.target.x - player.position.x) / distance;
        const sin = (player.target.y - player.position.y) / distance;
        const max_x_speed = MAX_SPEED * cos;
        const max_y_speed = MAX_SPEED * sin;
        const x = player.position.x + max_x_speed;
        const y = player.position.y + max_y_speed;
        player.position = { x, y };
      }




    }
  }

  // portals collisions

  private checkPortalsCollisions(worldMap: WorldMap) {

    const portals = worldMap.portals || [];
    const players = this.playerRepository.getPlayersByWorldMap(worldMap.id);
    const changes: WorldMapChange[] = [];

    for (let i = 0; i < players.length; i++) {
      const player = players[i];

      for (let p = 0; p < portals.length; p++) {
        const portal = portals[p];
        if (this.isInPortal(portal, player)) {
          player.worldMapId = portal.targetWorldMapId;
          player.position = portal.targetPosition;
          player.target = portal.targetPosition;
          this.playerRepository.updatePlayer(player);

          changes.push({
            playerId: player.id,
            fromWorldMapId: worldMap.id,
            toWorldMapId: portal.targetWorldMapId,
          });
          break;
        }
      }

    }

    // Aca iria un notify para reemplazar lo de abajo
    this.notifyPortalCollisionListeners(changes);
  }

  private isInPortal(portal: Portal, player: Player): boolean {
    return (
      player.position.x > portal.position.x &&
      player.position.y > portal.position.y &&
      player.position.x < portal.position.x + portal.size.width &&
      player.position.y < portal.position.y + portal.size.height
    );
  }

  // listeners
  private notifyWorldTickListeners(worldMap: WorldMap) {
    this.worldMapTickListeners.forEach(listener => {
      const worldStatus: WorldStatus = {
        world: worldMap,
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