import { Socket } from "socket.io";
import { GameServiceListener } from "../../../core/domain/services/GameServiceListener";

const PLAYER_ATTACK_MESSAGE = "player:attack";

export class PlayerAttackNotifier implements GameServiceListener {

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