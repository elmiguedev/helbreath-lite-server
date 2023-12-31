import { Player } from "../../domain/entities/player/Player";
import { PlayerRepository } from "../../domain/repositories/PlayerRepository";
import p2 from "p2";

export class InMemoryPlayerRepository implements PlayerRepository {

  private map = new Map<string, Player>();

  constructor(private readonly world: p2.World) {
    this.map = new Map();
  }
  addPlayer(player: Player): void {
    const body = new p2.Body({
      mass: 0,
      position: [player.position.x, player.position.y],
      // velocity: [100, 100]
    })
    body.addShape(new p2.Box({ width: player.bounds.width, height: player.bounds.height }));
    body.collisionResponse = true
    body.shapes[0].collisionGroup = 1
    body.shapes[0].collisionMask = 1

    this.world.addBody(body);
    player.body = body;

    this.map.set(player.id, player);

  }
  removePlayer(id: string): void {
    this.map.delete(id);
  }
  getPlayer(id: string): Player | undefined {
    return this.map.get(id);
  }
  getPlayers(): Player[] {
    return Array.from(this.map.values());
  }
  updatePlayer(player: Player): void {
    this.map.set(player.id, player);
  }

  getPlayersByWorldMap(worldMapId: string): Player[] {
    return this.getPlayers().filter(player => player.worldMapId === worldMapId);
  }
}