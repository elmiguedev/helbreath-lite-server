import { Socket } from "socket.io";
import { AttackMonsterAction } from "../../../core/interactions/actions/players/AttackMonsterAction";

export const PLAYER_ATTACK_MONSTER_MESSAGE = "player:attack:monster";

export class AttackMonsterHandler {
  constructor(private readonly socket: Socket, action: AttackMonsterAction) {
    socket.on(PLAYER_ATTACK_MONSTER_MESSAGE, (monsterId: string) => {
      action.execute({
        playerId: socket.id,
        targetId: monsterId
      })
    })
  }
}