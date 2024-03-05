import { PlayerService } from "../../domain/services/player/PlayerService";
import { ServiceListener } from "../../utils/ServiceListener";

export class PlayerAttackListener implements ServiceListener<string> {
  private listeners: ServiceListener<string>[] = [];

  constructor(
    private readonly playerService: PlayerService
  ) {
    this.playerService.addPlayerAttackListener(this);
  }

  public notify(playerId: string): void {
    this.listeners.forEach(listener => {
      listener.notify(playerId);
    })
  }

  public suscribe(listener: ServiceListener<string>) {
    this.listeners.push(listener);
  }
}