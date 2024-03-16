import { Socket } from "socket.io";
import { PlayerAttributes } from "../../../core/domain/entities/player/PlayerAttributes";
import { PlayerAttributesAction } from "../../../core/interactions/actions/players/PlayerAttributesAction";

export const PLAYER_ATTRIBUTES_MESSAGE = "player:attributes";
export interface PlayerAttributesHandlerParams extends PlayerAttributes { }

export class PlayerAttributesHandler {
  constructor(private readonly socket: Socket, action: PlayerAttributesAction) {
    socket.on(PLAYER_ATTRIBUTES_MESSAGE, (params: PlayerAttributesHandlerParams) => {
      action.execute({
        id: socket.id,
        attributes: params
      })
    })
  }
}