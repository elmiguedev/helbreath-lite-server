import { Socket } from "socket.io";
import { MovePlayerAction } from "../../../core/actions/MovePlayerAction";

export const MOVE_PLAYER_MESSAGE = "player:move";
export interface MovePlayerHandlerParams {
  x: number;
  y: number;
}

export class MovePlayerHandler {
  constructor(private readonly socket: Socket, action: MovePlayerAction) {
    socket.on(MOVE_PLAYER_MESSAGE, (params: MovePlayerHandlerParams) => {
      action.execute({
        id: socket.id,
        position: {
          x: params.x,
          y: params.y
        }
      })
    })
  }
}