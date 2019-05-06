import { Router, Request, Response, NextFunction } from 'express';
import { Building } from 'src/Building';

const router: Router = Router();

const all = require('./all');
router.use('/', all);

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


const single = require('./single');
router.use('/:roomNumber', single);

// export const index: Router = router;

export = router;