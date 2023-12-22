import { WorldMap } from "../domain/entities/WorldMap";
import { GameService } from "../domain/services/GameService";
import { GameServiceListener } from "../domain/services/GameServiceListener";

// TODO: como el action. aca podriamos ponerle un generico para la devolucion del tipo de datos
export class WorldMapTickListener implements GameServiceListener {
  private listeners: GameServiceListener[] = [];

  constructor(private readonly gameService: GameService) {
    this.gameService.addWorldMapTickListener(this);
  }

  public notify(worldMap: WorldMap): void {
    this.listeners.forEach(listener => {
      listener.notify(worldMap);
    })
  }

  // TODO: investigar event listener
  public suscribe(listener: GameServiceListener) {
    this.listeners.push(listener);
  }
}