import { Server, Socket } from "socket.io";
import { GameServiceListener } from "../../../core/domain/services/GameServiceListener";
import { WorldMapChange } from "../../../core/domain/entities/world/WorldMapChange";

export class PortalCollisionNotifier implements GameServiceListener {

  constructor(private readonly sockets: Record<string, Socket>) { }

  notify(changes: WorldMapChange[]): void {
    changes.forEach((change: WorldMapChange) => {
      const playerSocket = this.sockets[change.playerId];
      playerSocket.leave(change.fromWorldMapId);
      playerSocket.join(change.toWorldMapId);
      playerSocket.emit("world:change", change);
      playerSocket.broadcast.emit("player:disconnected", change.playerId);
    });
  }

}