import { Router, Response, NextFunction } from "express";
import { Building } from "@ccss-support-manual/models";
import { RoomUtils } from "@ccss-support-manual/utilities";

import all from "./all";
import single from "./single";

const router: Router = Router();

router.param("roomNumber", (req: any, _res: Response, next: NextFunction, number: string): void => {
    let building: Building = req.building;
    let room = RoomUtils.getRoomByNumber(building, number);
    if (room) {
        req.room = room;
        next();
        return;
    }
    next(new Error("Failed to find room: " + number));
});

router.use("/", all);

router.use("/:roomNumber", single);

export default router;