import { Monster } from "../../../domain/entities/monster/Monster";
import { MonsterService } from "../../../domain/services/monster/MonsterService";
import { PlayerService } from "../../../domain/services/player/PlayerService";
import { WorldMapService } from "../../../domain/services/worldmap/WorldMapService";
import { GAME_LOOP_INTERVAL, MAP_TILE_SIZE } from "../../../utils/Constants";
import { MathUtils } from "../../../utils/MathUtils";
import { Action } from "../Action";

export class StartGameAction implements Action<void, void> {
  private gameLoopTimers: Record<string, any> = {};

  constructor(
    private readonly playerService: PlayerService,
    private readonly monsterService: MonsterService,
    private readonly worldMapService: WorldMapService,
  ) { }

  execute(): void {
    this.createDummyPit("testMap");

    this.worldMapService.getAll().forEach(worldMap => {
      this.gameLoopTimers[worldMap.id] = setInterval(() => {

        this.playerService.updatePlayersPosition(worldMap);
        this.worldMapService.notifyWorldStatus(worldMap);

      }, GAME_LOOP_INTERVAL);
    });

  }

  // TODO: esto deberia ir o bien en el mosnter service o bien en el world map service
  private createDummyPit(worldMapId: string) {
    setInterval(() => {
      if (this.monsterService.getMonstersByWorldMap(worldMapId).length <= 6) {
        const monster: Monster = {
          id: MathUtils.getRandomId(),
          type: "dummy",
          name: "dummy",
          position: {
            x: MathUtils.getRandomBetween(5000, 6000),
            y: MathUtils.getRandomBetween(6000, 7000)
          },
          size: {
            width: MAP_TILE_SIZE,
            height: MAP_TILE_SIZE
          },
          worldMapId: worldMapId,
          stats: {
            maxHealth: 60, // TODO: en realidad tiene una tirada el dummy de 10d8, pero despues lo veremos
            health: 60,
            maxMana: 0,
            mana: 0,
            damage: 0,
            defenseRatio: 80,
            hitRatio: 30,
            physicalAbsortion: 0,
            minExperience: 162,
            maxExperience: 292
          }
        };

        this.monsterService.addMonster(monster);

      }
    }, 10000)
  }

}