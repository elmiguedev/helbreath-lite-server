import { Socket } from "socket.io";
import { RemovePlayerAction } from "../../../core/actions/players/RemovePlayerAction";

export const REMOVE_PLAYER_MESSAGE = "disconnect";

export class RemovePlayerHandler {
  constructor(sockets: Record<string, Socket>, socket: Socket, action: RemovePlayerAction) {
    socket.on(REMOVE_PLAYER_MESSAGE, () => {
      action.execute({ id: socket.id });
      socket.broadcast.emit("player:disconnected", socket.id);
      delete sockets[socket.id];
    })
  }
}