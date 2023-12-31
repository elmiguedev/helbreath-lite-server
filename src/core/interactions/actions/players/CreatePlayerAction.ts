import { PlayerRepository } from "../../../domain/repositories/PlayerRepository";
import { Action } from "../Action";

export interface CreatePlayerActionParams {
  id: string;
  name: string;
  worldMapId: string;
}

export class CreatePlayerAction implements Action<CreatePlayerActionParams, void> {

  constructor(private readonly playerRepository: PlayerRepository) { }

  public execute(params: CreatePlayerActionParams): void {
    this.playerRepository.addPlayer({
      id: params.id,
      name: params.name,
      worldMapId: params.worldMapId,
      attributes: {
        vitality: 10,
        charisma: 10,
        dexterity: 10,
        strength: 10,
        intelligence: 10,
        magic: 10,
        luck: 10
      },
      bounds: {
        width: 16,
        height: 16,
      },
      stats: {
        experience: 0,
        health: 100,
        level: 1,
        mana: 100,
        maxHealth: 100,
        maxMana: 100,
        maxStamina: 100,
        stamina: 100
      },
      position: {
        x: 620,
        y: 580
      }
    })
  }
}