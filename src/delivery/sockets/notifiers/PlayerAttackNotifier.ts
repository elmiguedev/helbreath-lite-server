import { Socket } from "socket.io";
import { ServiceListener } from "../../../core/utils/ServiceListener";

const PLAYER_ATTACK_MESSAGE = "player:attack";

export class PlayerAttackNotifier implements ServiceListener<string> {

  constructor(private readonly sockets: Record<string, Socket>) { }

  notify(playerId: string): void {
    const playerSocket = this.sockets[playerId];
    playerSocket
      .broadcast
      .emit(PLAYER_ATTACK_MESSAGE, playerId);
    playerSocket
      .emit(PLAYER_ATTACK_MESSAGE, playerId);
  }

}