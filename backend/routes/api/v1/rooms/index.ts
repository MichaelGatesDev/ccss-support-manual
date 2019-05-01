import { Router, Request, Response, NextFunction } from 'express';
import { app } from '../../../../App';

const router: Router = Router();

const all = require('./all');
router.use('/', all);

router.param('roomID', function (req: any, res: Response, next: NextFunction, id: string) {
    console.log(app);
    let room = app.getDataManager().getRoomManager().getRoomByID(id);
    if (room) {
        req.room = room;
        next();
        return;
    }
    next(new Error('Failed to find room: ' + id));
});

const single = require('./single');
router.use('/:roomID', single);

// export const index: Router = router;

export = router;