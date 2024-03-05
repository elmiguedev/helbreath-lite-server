import { ServiceListener } from "../../../utils/ServiceListener";
import { WorldMap } from "../../entities/world/WorldMap";
import { WorldStatus } from "../../entities/world/WorldStatus";

export interface WorldMapService {
  addWorldStatusListener(listener: ServiceListener<WorldStatus>): void;
  notifyWorldStatus(worldMap: WorldMap): void;
  getAll(): WorldMap[];
}