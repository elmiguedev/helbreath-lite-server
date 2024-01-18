import { Server, Socket } from "socket.io";
import { GameServiceListener } from "../../../core/domain/services/GameServiceListener";
import { Monster } from "../../../core/domain/entities/monster/Monster";

export const MONSTER_KILLED_MESSAGE = "monster:killed";

export class MonsterKilledNotifier implements GameServiceListener {
  constructor(private readonly socketServer: Server) { }

  notify(monster: Monster): void {
    this.socketServer
      .to(monster.worldMapId)
      .emit(MONSTER_KILLED_MESSAGE, monster);
  }

}