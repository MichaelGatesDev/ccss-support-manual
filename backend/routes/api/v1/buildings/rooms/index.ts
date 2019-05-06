import { Router, Request, Response, NextFunction } from 'express';
import { Building } from 'src/Building';

const router: Router = Router();

router.param('roomNumber', function (req: any, res: Response, next: NextFunction, number: string) {
    let building: Building = req.building;
    let room = building.getRoom(number);
    if (room) {
        req.room = room;
        next();
        return;
    }
    next(new Error('Failed to find room: ' + number));
});

import all from './all';
router.use('/', all);

import single from './single';
router.use('/:roomNumber', single);

export default router;