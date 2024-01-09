import { Server, Socket } from "socket.io";
import { GameServiceListener } from "../../../core/domain/services/GameServiceListener";
import { WorldStatus } from "../../../core/domain/entities/world/WorldStatus";

export const WORLD_STATUS_MESSAGE = "world:status"

export class WorldStatusNotifier implements GameServiceListener {

  constructor(private readonly socketServer: Server) { }

  notify(worldStatus: WorldStatus): void {
    this.socketServer
      .to(worldStatus.world.id)
      .emit(WORLD_STATUS_MESSAGE, worldStatus);
  }

}