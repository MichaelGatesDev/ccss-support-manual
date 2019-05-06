import { Router, Request, Response, NextFunction } from 'express';
import { app } from '../../../../../src/App';

const router: Router = Router();

router.get('/', (req: any, res: Response) => {
    res.json(app.getDataManager().getRoomManager().getRooms());
});

export = router;