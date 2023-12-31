import { Block } from "../generic/Block";
import { Position } from "../generic/Position"
import { Size } from "../generic/Size";

export interface PortalBlock extends Block {
  worldMapId: string;
  position: Position;
  target: PortalBlockTarget;
}

export interface PortalBlockTarget {
  worldMapId: string;
  position: Position;
}

