import { Server, Socket } from "socket.io";
import { Monster } from "../../../core/domain/entities/monster/Monster";
import { ServiceListener } from "../../../core/utils/ServiceListener";

export const MONSTER_KILLED_MESSAGE = "monster:killed";

export class MonsterKilledNotifier implements ServiceListener<Monster> {
  constructor(private readonly socketServer: Server) { }

  notify(monster: Monster): void {
    this.socketServer
      .to(monster.worldMapId)
      .emit(MONSTER_KILLED_MESSAGE, monster);
  }

}