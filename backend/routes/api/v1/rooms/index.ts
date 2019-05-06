import { Router, Request, Response, NextFunction } from 'express';
import { app } from '../../../../src/App';

const router: Router = Router();

router.get('/', function (req: Request, res: Response, next: NextFunction) {
    res.json(app.getDataManager().getRoomManager().getRooms())
});

export = router;