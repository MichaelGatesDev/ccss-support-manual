import { Router, Response, NextFunction } from 'express';
import { app } from '../../../../app';

const router: Router = Router();


router.get("/", function (_req, res) {
    res.json(app.getDataManager().getImageManager().getBuildingImages());
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


router.get("/:buildingName", function (req: any, res) {
    res.json(app.getDataManager().getImageManager().getImagesForBuilding(req.building.internalName));
});

import roomsRoute from './rooms';
router.use('/:buildingName/rooms', roomsRoute);

export default router;