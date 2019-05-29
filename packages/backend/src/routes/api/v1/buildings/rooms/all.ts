import { Router, Response } from 'express';
import { app } from '../../../../../app';

const router: Router = Router();

router.get('/', (_req: any, res: Response) => {
    res.json(app.getDataManager().getRoomManager().getRooms());
});

export default router;