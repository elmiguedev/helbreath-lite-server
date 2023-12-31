import { Server, Socket } from "socket.io";
import { GameServiceListener } from "../../../core/domain/services/GameServiceListener";
import { WorldStatus } from "../../../core/domain/entities/world/WorldStatus";

export class WorldStatusNotifier implements GameServiceListener {

  constructor(private readonly socketServer: Server) { }

  notify(worldStatus: WorldStatus): void {
    this.socketServer
      .to(worldStatus.world.id)
      // .emit("world:state", worldStatus);
      .emit("world:state", {
        world: worldStatus.world,
        players: worldStatus.players.map(p => ({
          id: p.id,
          name: p.name,
          worldMapId: p.worldMapId,
          position: {
            x: p.body!.position[0],
            y: p.body!.position[1]
          }
        }))
      });
  }

}