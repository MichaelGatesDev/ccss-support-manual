import { Router, Request, Response, NextFunction } from 'express';
import { app } from '../../../../app';

const router: Router = Router();

router.get('/', function (_req: Request, res: Response, _next: NextFunction) {
    res.json(app.getDataManager().getRoomManager().getRooms())
});

export default router;