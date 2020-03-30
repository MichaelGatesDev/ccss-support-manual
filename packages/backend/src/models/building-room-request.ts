import { Request } from "express";

import { Building, Room } from "@ccss-support-manual/models";

export interface BuildingRoomRequest extends Request {
  building?: Building;
  room?: Room;
}
