import { ROOM_LOGIC_TIME } from "../utils/Constants";
import { Player } from "./Player";

export class Room {
  private name: string;
  private players: Record<string, Player>;
  private timer: any;

  public onRefresh?: Function;

  constructor(name: string) {
    this.name = name;
    this.players = {}
  }

  public createGameLoop() {
    this.timer = setInterval(() => {

      this.updatePlayerPositions();

      if (this.onRefresh) {
        this.onRefresh();
      }
    }, ROOM_LOGIC_TIME)
  }

  public addPlayer(player: Player) {
    this.players[player.getId()] = player;
  }

  public removePlayer(id: string) {
    delete this.players[id];
  }

  public getPlayer(id: string) {
    return this.players[id];
  }

  public getState() {
    return {
      name: this.name,
      players: Object.values(this.players).map(player => player.getState())
    }
  }

  private updatePlayerPositions() {
    Object.values(this.players).forEach(player => {
      player.updatePosition();
    })
  }
}