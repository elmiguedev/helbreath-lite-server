import { Server, Socket } from "socket.io";
import { GameServiceListener } from "../../../core/domain/services/GameServiceListener";
import { WorldStatus } from "../../../core/domain/entities/WorldStatus";

export class WorldStatusNotifier implements GameServiceListener {

  constructor(private readonly socketServer: Server) { }

  notify(worldStatus: WorldStatus): void {
    this.socketServer
      .to(worldStatus.world.id)
      .emit("world:state", worldStatus);
  }

}