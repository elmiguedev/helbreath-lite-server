import { WorldMapChange } from "../../domain/entities/world/WorldMapChange";
import { PlayerService } from "../../domain/services/player/PlayerService";
import { ServiceListener } from "../../utils/ServiceListener";

export class PlayerChangeMapListener implements ServiceListener<WorldMapChange[]> {
  private listeners: ServiceListener<WorldMapChange[]>[] = [];

  constructor(
    private readonly playerService: PlayerService
  ) {
    this.playerService.addPlayerChangeMapListener(this);
  }

  public notify(changes: WorldMapChange[]): void {
    this.listeners.forEach(listener => {
      listener.notify(changes);
    })
  }

  public suscribe(listener: ServiceListener<WorldMapChange[]>) {
    this.listeners.push(listener);
  }
}