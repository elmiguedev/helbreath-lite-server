import { Server, Socket } from "socket.io";
import { GameServiceListener } from "../../../core/domain/services/GameServiceListener";
import { MonsterKilledListenerParams } from "../../../core/interactions/listeners/MonsterKilledListener";

export const MONSTER_KILLED_MESSAGE = "monster:killed";

export class MonsterKilledNotifier implements GameServiceListener {
  constructor(private readonly socketServer: Server) { }

  notify(params: MonsterKilledListenerParams): void {
    console.log(params);
    this.socketServer
      .to(params.monster.worldMapId)
      .emit(MONSTER_KILLED_MESSAGE, params);
  }

}