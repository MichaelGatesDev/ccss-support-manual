import { Router, Request, Response, NextFunction } from 'express';
import { app } from '../../../../src/App';
import { Building } from '../../../../src/Building';

const router: Router = Router();


router.get("/", function (req, res) {
    const tdm = app.getDataManager().getTroubleshootingDataManager();
    res.json(tdm.getTroubleshootingData());
    console.warn("This route should not be used.");
});

router.param('buildingName', function (req: any, res: Response, next: NextFunction, id: string) {
    let building = app.getDataManager().getBuildingManager().getBuildingByName(id);
    if (building) {
        req.building = building;
        next();
        return;
    }
    next(new Error('Failed to find building: ' + id));
    return;
});

router.get("/:buildingName", function (req: any, res) {
    const tdm = app.getDataManager().getTroubleshootingDataManager();
    res.json(tdm.getTroubleshootingData());
    console.warn("This route should not be used.");
});

import roomsRoute from './rooms';
router.use('/:buildingName/rooms', roomsRoute);

export default router;