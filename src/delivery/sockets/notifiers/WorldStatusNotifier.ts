import { Server, Socket } from "socket.io";
import { WorldStatus } from "../../../core/domain/entities/world/WorldStatus";
import { ServiceListener } from "../../../core/utils/ServiceListener";

export const WORLD_STATUS_MESSAGE = "world:status"

export class WorldStatusNotifier implements ServiceListener<WorldStatus> {

  constructor(private readonly socketServer: Server) { }

  notify(worldStatus: WorldStatus): void {
    this.socketServer
      .to(worldStatus.world.id)
      .emit(WORLD_STATUS_MESSAGE, worldStatus);
  }

}