import { Socket } from "socket.io";
import { GameServiceListener } from "../../../core/domain/services/GameServiceListener";

const PLAYER_ATTACK_MESSAGE = "player:attack";

export interface PlayerAttackNotifierParams {
  playerId: string;
}

export class PlayerAttackNotifier implements GameServiceListener {

  constructor(private readonly sockets: Record<string, Socket>) { }

  notify(params: PlayerAttackNotifierParams): void {
    console.log("PASA AL NOTIFIER", params);
    const playerSocket = this.sockets[params.playerId];
    playerSocket
      .broadcast
      .emit(PLAYER_ATTACK_MESSAGE, params);
  }

}