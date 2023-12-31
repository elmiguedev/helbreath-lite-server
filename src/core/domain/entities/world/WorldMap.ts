import { Size } from "../generic/Size";
import { PortalBlock } from "./PortalBlock";
import { SolidBlock } from "./SolidBlock";

export interface WorldMap {
  id: string;
  name: string;
  size: Size;
  portals: PortalBlock[];
  solids: SolidBlock[]
}