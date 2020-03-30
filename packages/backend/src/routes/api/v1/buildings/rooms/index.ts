import { Router, Response, NextFunction } from "express";

import { Building } from "@ccss-support-manual/models";

import { app } from "../../../../../app";
import { BuildingRoomRequest } from "../../../../../models/building-room-request";
import all from "./all";
import single from "./single";
import add from "./add";

const router: Router = Router();

router.use("/", all);
router.use("/add", add);
router.param(
  "roomNumber",
  (
    req: BuildingRoomRequest,
    _res: Response,
    next: NextFunction,
    roomNumber: string
  ): void => {
    const building: Building = req.building!;
    const room = app.roomManager.getRoom(building.internalName, roomNumber);
    if (room !== undefined) {
      req.room = room;
      next();
    } else {
      next(new Error(`Failed to find room: ${roomNumber}`));
    }
  }
);
router.use("/:roomNumber", single);

export default router;
