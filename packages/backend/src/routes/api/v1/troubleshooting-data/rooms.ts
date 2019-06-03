import { Router, Response, NextFunction } from 'express';
import { app } from '../../../../app';

import { Building, RoomUtils } from '@ccss-support-manual/common';

const router: Router = Router();

router.get("/", function (_req, res) {
    const tdm = app.getDataManager().getTroubleshootingDataManager();
    res.json(tdm.getTroubleshootingData());
    console.warn("This route should not be used.");
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
    const tdm = app.getDataManager().getTroubleshootingDataManager();
    res.json(tdm.getTroubleshootingDataForRoom(req.building.internalName, req.room.number));
});

export default router;