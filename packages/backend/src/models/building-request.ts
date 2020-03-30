import { Request } from "express";

import { Building } from "@ccss-support-manual/models";

export interface BuildingRequest extends Request {
  building?: Building;
}
