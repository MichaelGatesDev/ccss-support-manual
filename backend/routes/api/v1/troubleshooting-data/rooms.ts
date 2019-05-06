import { Router, Request, Response, NextFunction } from 'express';
import { app } from '../../../../src/App';
import { Building } from '../../../../src/Building';

const router: Router = Router();

router.get("/", function (req, res) {
    const tdm = app.getDataManager().getTroubleshootingDataManager();
    res.json(tdm.getTroubleshootingData());
    console.warn("This route should not be used.");
});

router.param('roomNumber', function (req: any, res: Response, next: NextFunction, id: string) {
    let building: Building = req.building;
    let room = building.getRoom(id);
    if (room) {
        req.room = room;
        next();
        return;
    }
    next(new Error('Failed to find room: ' + id));
    return;
});

router.get("/:roomNumber", function (req: any, res) {
    const tdm = app.getDataManager().getTroubleshootingDataManager();
    res.json(tdm.getTroubleshootingDataForRoom(req.building.internalName, req.room.number));
});

export = router;