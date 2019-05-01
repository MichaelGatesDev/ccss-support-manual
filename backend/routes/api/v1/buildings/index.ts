import { Router, Request, Response, NextFunction } from 'express';
import { app } from '../../../../App';

const router: Router = Router();

router.param('buildingID', function (req: any, res: Response, next: NextFunction, id: string) {
    for (const building of app.getDataManager().getBuildingManager().getBuildings()) {
        if (building.getInternalName() == id) {
            req.building = building;
            next();
            return;
        }
    }
    next(new Error('Failed to find building: ' + id));
});

const all = require('./all');
router.use('/', all);

const single = require('./single');
router.use('/:buildingID', single);


// export const index: Router = router;

// export {
//     router
// }

export = router;