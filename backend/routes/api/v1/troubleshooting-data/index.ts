import { Router, Request, Response, NextFunction } from 'express';
import app from '../../../../App';

const router: Router = Router();

import allRoute from './all';
router.use('/', allRoute);

router.param('roomID', function (req: any, res: Response, next: NextFunction, id: string) {
    let troubleshootingData = app.getDataManager().getTroubleshootingDataManager().getTroubleshootingDataForRoom(id);
    if (troubleshootingData) {
        req.troubleshootingData = troubleshootingData;
        next();
        return;
    }
    next(new Error('Failed to find room: ' + id));
});

const single = require('./single');
router.use('/:roomID', single);

export = router;