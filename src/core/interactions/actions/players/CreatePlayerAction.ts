import { Player } from "../../../domain/entities/player/Player";
import { PlayerRepository } from "../../../domain/repositories/PlayerRepository";
import { GameService } from "../../../domain/services/GameService";
import { Action } from "../Action";

export interface CreatePlayerActionParams {
  id: string;
  name: string;
  worldMapId: string;
}

export class CreatePlayerAction implements Action<CreatePlayerActionParams, void> {

  constructor(private readonly gameService: GameService) { }

  public execute(params: CreatePlayerActionParams): void {
    // TODO:  esto no va aca sino que se trae de la base de 
    //        datos del juego. Para mockupear el player le
    //        ponemos stats de uno de
    const player: Player = {
      id: params.id,
      name: params.name,
      worldMapId: params.worldMapId,
      attributes: {
        vitality: 20,
        charisma: 10,
        dexterity: 30,
        strength: 20,
        intelligence: 10,
        magic: 10,
        luck: 10
      },
      bounds: {
        width: 16,
        height: 16,
      },
      stats: {
        experience: 13365,
        health: 122,
        level: 11,
        mana: 67,
        maxHealth: 122,
        maxMana: 67,
        maxStamina: 122,
        stamina: 122
      },
      position: {
        x: 620,
        y: 580
      },
      skills: {
        axe: 100,
        hammer: 100,
        longSword: 100,
        shortSword: 100,
        staff: 100
      }
    };
    this.gameService.addPlayer(player);
  }
}