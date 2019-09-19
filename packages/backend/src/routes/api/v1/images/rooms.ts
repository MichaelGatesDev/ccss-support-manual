import { Router, Response, NextFunction } from "express";
import { app } from "../../../../app";
import { Building } from "@ccss-support-manual/models";
import { RoomUtils } from "@ccss-support-manual/utilities";

const router: Router = Router();


router.get("/", (_req, res): void => {
    res.status(200).json(app.imageManager.roomImages);
});

router.param("roomNumber", (req: any, _res: Response, next: NextFunction, roomNumber: string): void => {
    let building: Building = req.building;
    let room = RoomUtils.getRoomByNumber(building, roomNumber);
    if (room) {
        req.room = room;
        next();
        return;
    }
    next(new Error("Failed to find room: " + roomNumber));
    return;
});

router.get("/:roomNumber", (req: any, res): void => {
    res.status(200).json(app.imageManager.getImagesForRoom(req.building.internalName, req.room.number));
});

export default router;