import { Player } from "../../domain/entities/player/Player";
import { PlayerService } from "../../domain/services/player/PlayerService";
import { ServiceListener } from "../../utils/ServiceListener";

export class PlayerLevelUpListener implements ServiceListener<Player> {
  private listeners: ServiceListener<Player>[] = [];

  constructor(
    private readonly playerService: PlayerService
  ) {
    this.playerService.addLevelUpListener(this);
  }

  public notify(player: Player): void {
    this.listeners.forEach(listener => {
      listener.notify(player);
    })
  }

  public suscribe(listener: ServiceListener<Player>) {
    this.listeners.push(listener);
  }
}