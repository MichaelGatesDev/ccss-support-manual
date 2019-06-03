import { Router, Response, NextFunction } from 'express';
import { app } from '../../../../app';

import { Building, RoomUtils } from '@ccss-support-manual/common';

const router: Router = Router();


router.get("/", function (_req, res) {
    res.json(app.getDataManager().getImageManager().getRoomImages());
});

router.param('roomNumber', function (req: any, _res: Response, next: NextFunction, roomNumber: string) {
    let building: Building = req.building;
    let room = RoomUtils.getRoomByNumber(building, roomNumber);
    if (room) {
        req.room = room;
        next();
        return;
    }
    next(new Error('Failed to find room: ' + roomNumber));
    return;
});

router.get("/:roomNumber", function (req: any, res) {
    res.json(app.getDataManager().getImageManager().getImagesForRoom(req.building.internalName, req.room.number));
});

export default router;