import { Player } from "../../domain/entities/Player";
import { Portal } from "../../domain/entities/Portal";
import { WorldMapChange } from "../../domain/entities/WorldMapChange";
import { PlayerRepository } from "../../domain/respositories/PlayerRepository";
import { WorldMapRepository } from "../../domain/respositories/WorldMapRepository";
import { Action } from "../Action";

export class CheckPlayerInPortalAction implements Action<string, WorldMapChange[]> {
  constructor(private readonly playerRepository: PlayerRepository, private readonly worldRepository: WorldMapRepository) { }

  public execute(worldMapId: string): WorldMapChange[] {
    const world = this.worldRepository.getById(worldMapId);
    const portals = world?.portals || [];
    const players = this.playerRepository.getPlayersByWorldMap(worldMapId);
    const changes: WorldMapChange[] = [];

    for (let i = 0; i < players.length; i++) {
      const player = players[i];

      for (let p = 0; p < portals.length; p++) {
        const portal = portals[p];
        if (this.isInPortal(portal, player)) {
          this.updatePlayerPosition(player, portal);
          changes.push(this.createWorldMapChange(player, worldMapId, portal.targetWorldMapId));
          break;
        }
      }

    }

    return changes;
  }

  private isInPortal(portal: Portal, player: Player): boolean {
    return (
      player.position.x > portal.position.x &&
      player.position.y > portal.position.y &&
      player.position.x < portal.position.x + portal.size.width &&
      player.position.y < portal.position.y + portal.size.height
    );
  }

  private updatePlayerPosition(player: Player, portal: Portal): void {
    player.worldMapId = portal.targetWorldMapId;
    player.position = portal.targetPosition;
    player.target = portal.targetPosition;
    this.playerRepository.updatePlayer(player);
  }

  private createWorldMapChange(player: Player, fromWorldMapId: string, toWorldMapId: string): WorldMapChange {
    return {
      playerId: player.id,
      fromWorldMapId: fromWorldMapId,
      toWorldMapId: toWorldMapId,
    }
  }


}