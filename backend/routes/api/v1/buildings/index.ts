import { Router, Request, Response, NextFunction } from 'express';
import { app } from '../../../../src/App';

const router: Router = Router();

router.param('buildingName', function (req: any, res: Response, next: NextFunction, id: string) {
    let building = app.getDataManager().getBuildingManager().getBuildingByName(id);
    if (building) {
        req.building = building;
        next();
        return;
    }
    next(new Error('Failed to find building: ' + id));
});

import all from './all';
router.use('/', all);

import single from './single';
router.use('/:buildingName', single);

export default router;