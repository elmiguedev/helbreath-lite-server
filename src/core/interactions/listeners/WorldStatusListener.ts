import { WorldStatus } from "../../domain/entities/world/WorldStatus";
import { WorldMapService } from "../../domain/services/worldmap/WorldMapService";
import { ServiceListener } from "../../utils/ServiceListener";

export class WorldStatusListener implements ServiceListener<WorldStatus> {
  private listeners: ServiceListener<WorldStatus>[] = [];

  constructor(private readonly worldMapService: WorldMapService) {
    this.worldMapService.addWorldStatusListener(this);
  }

  public notify(worldMapStatus: WorldStatus): void {
    this.listeners.forEach(listener => {
      listener.notify(worldMapStatus);
    })
  }

  public suscribe(listener: ServiceListener<WorldStatus>) {
    this.listeners.push(listener);
  }
}