import { Router, Response, NextFunction } from 'express';
import { app } from '../../../../src/app';

const router: Router = Router();


router.get("/", function (_req, res) {
    const tdm = app.getDataManager().getTroubleshootingDataManager();
    res.json(tdm.getTroubleshootingData());
    console.warn("This route should not be used.");
});

router.param('buildingName', function (req: any, _res: Response, next: NextFunction, id: string) {
    let building = app.getDataManager().getBuildingManager().getBuildingByName(id);
    if (building) {
        req.building = building;
        next();
        return;
    }
    next(new Error('Failed to find building: ' + id));
    return;
});

router.get("/:buildingName", function (_req: any, res) {
    const tdm = app.getDataManager().getTroubleshootingDataManager();
    res.json(tdm.getTroubleshootingData());
    console.warn("This route should not be used.");
});

import roomsRoute from './rooms';
router.use('/:buildingName/rooms', roomsRoute);

export default router;