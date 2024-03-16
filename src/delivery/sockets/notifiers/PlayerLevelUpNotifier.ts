import { Socket } from "socket.io";
import { ServiceListener } from "../../../core/utils/ServiceListener";
import { Player } from "../../../core/domain/entities/player/Player";

const PLAYER_LEVEL_UP_MESSAGE = "player:levelup";

export class PlayerLevelUpNotifier implements ServiceListener<Player> {

  constructor(private readonly sockets: Record<string, Socket>) { }

  notify(player: Player): void {
    console.log()
    console.log("NOTIFY LEVEL UP", player)
    console.log()
    const playerSocket = this.sockets[player.id];
    playerSocket.emit(PLAYER_LEVEL_UP_MESSAGE, player);
  }

}