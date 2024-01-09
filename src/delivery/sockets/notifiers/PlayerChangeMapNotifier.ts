import { Socket } from "socket.io";
import { GameServiceListener } from "../../../core/domain/services/GameServiceListener";
import { WorldMapChange } from "../../../core/domain/entities/world/WorldMapChange";

export const WORLD_CHANGE_MESSAGE = "world:change"
export const PLAYER_DISCONNECTED_MESSAGE = "player:disconnected"

export class PlayerChangeMapNotifier implements GameServiceListener {

  constructor(private readonly sockets: Record<string, Socket>) { }

  notify(changes: WorldMapChange[]): void {
    changes.forEach((change: WorldMapChange) => {
      const playerSocket = this.sockets[change.playerId];
      playerSocket.leave(change.fromWorldMapId);
      playerSocket.join(change.toWorldMapId);
      playerSocket.emit(WORLD_CHANGE_MESSAGE, change);
      playerSocket.broadcast.emit(PLAYER_DISCONNECTED_MESSAGE, change.playerId);
    });
  }

}