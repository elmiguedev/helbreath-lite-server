import { Position } from "../../../domain/entities/generic/Position";
import { Player } from "../../../domain/entities/player/Player";
import { PlayerAttributes } from "../../../domain/entities/player/PlayerAttributes";
import { PlayerService } from "../../../domain/services/player/PlayerService";
import { Action } from "../Action";

export interface PlayerAttributesActionParams {
  id: string;
  attributes: PlayerAttributes;
}

export class PlayerAttributesAction implements Action<PlayerAttributesActionParams, void> {
  constructor(
    private readonly playerService: PlayerService
  ) { }

  public execute(params: PlayerAttributesActionParams): void {
    const player = this.playerService.getPlayer(params.id);
    if (player && this.validate(player, params)) {
      player.attributes.charisma += params.attributes.charisma;
      player.attributes.dexterity += params.attributes.dexterity;
      player.attributes.intelligence += params.attributes.intelligence;
      player.attributes.luck += params.attributes.luck;
      player.attributes.magic += params.attributes.magic;
      player.attributes.strength += params.attributes.strength;

      player.stats.freeLevelPoints -= Object.values(params.attributes).reduce((a, b) => a + b, 0);
    }
  }

  private validate(player: Player, params: PlayerAttributesActionParams): boolean {
    if (!params.id) return false;
    if (!params.attributes) return false;
    const attributesTotalPoints = Object.values(params.attributes).reduce((a, b) => a + b, 0);
    if (attributesTotalPoints > player.stats.freeLevelPoints) return false;
    return true;
  }
}