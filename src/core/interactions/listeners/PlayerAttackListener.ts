import { GameService } from "../../domain/services/GameService";
import { GameServiceListener } from "../../domain/services/GameServiceListener";

export interface PlayerAttackListenerParams {
  playerId: string
}

export class PlayerAttackListener implements GameServiceListener {
  private listeners: GameServiceListener[] = [];

  constructor(private readonly gameService: GameService) {
    this.gameService.addPlayerAttackListener(this);
  }

  public notify(params: PlayerAttackListenerParams): void {
    this.listeners.forEach(listener => {
      listener.notify(params);
    })
  }

  public suscribe(listener: GameServiceListener) {
    this.listeners.push(listener);
  }
}