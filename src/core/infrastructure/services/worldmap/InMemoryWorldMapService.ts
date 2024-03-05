import { WorldMap } from "../../../domain/entities/world/WorldMap";
import { WorldStatus } from "../../../domain/entities/world/WorldStatus";
import { MonsterRepository } from "../../../domain/repositories/monster/MonsterRepository";
import { PlayerRepository } from "../../../domain/repositories/player/PlayerRepository";
import { WorldMapRepository } from "../../../domain/repositories/worldmap/WorldMapRepository";
import { WorldMapService } from "../../../domain/services/worldmap/WorldMapService";
import { ServiceListener } from "../../../utils/ServiceListener";

export class InMemoryWorldMapService implements WorldMapService {

  private worldStatusListeners: ServiceListener<WorldStatus>[] = [];

  constructor(
    private readonly worldMapRepository: WorldMapRepository,
    private readonly playerRepository: PlayerRepository,
    private readonly monsterRepository: MonsterRepository,

  ) { }

  public getAll(): WorldMap[] {
    return this.worldMapRepository.getAll();
  }

  public addWorldStatusListener(listener: ServiceListener<WorldStatus>): void {
    this.worldStatusListeners.push(listener);
  }

  public notifyWorldStatus(worldMap: WorldMap): void {
    this.worldStatusListeners.forEach(listener => {
      const worldStatus: WorldStatus = {
        world: {
          id: worldMap.id,
          name: worldMap.name
        },
        players: this.playerRepository.getAll(),
        monsters: this.monsterRepository.getAll()
      }

      listener.notify(worldStatus);
    });
  }

}