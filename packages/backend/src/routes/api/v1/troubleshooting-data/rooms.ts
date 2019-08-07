import { Router, Response, NextFunction } from "express";
import { app } from "../../../../app";

import { Building } from "@ccss-support-manual/models";
import { RoomUtils } from "@ccss-support-manual/utilities";

const router: Router = Router();

router.get("/", (_req, res): void => {
    res.json({});
    console.warn("This route should not be used.");
});

router.param("roomNumber", (req: any, _res: Response, next: NextFunction, roomNumber: string): void => {
    const building: Building = req.building;
    const room = RoomUtils.getRoomByNumber(building, roomNumber);
    if (room) {
        req.room = room;
        next();
        return;
    }
    next(new Error("Failed to find room: " + roomNumber));
    return;
});

router.get("/:roomNumber", (req: any, res): void => {
    res.json(app.troubleshootingDataManager.getTroubleshootingDataForRoom(req.building.internalName, req.room.number));
});

export default router;