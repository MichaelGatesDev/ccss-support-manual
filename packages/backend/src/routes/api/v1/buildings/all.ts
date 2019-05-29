import { Router, Request, Response, NextFunction } from 'express';
import { app } from '../../../../app';

const router: Router = Router();

router.get('/', (_req: Request, res: Response, _next: NextFunction) => {
    res.json(app.getDataManager().getBuildingManager().getBuildings());
});

export default router;