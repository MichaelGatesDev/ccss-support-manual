import { Router, Request, Response, NextFunction } from 'express';
import { app } from '../../../../src/App';

const router: Router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.json(app.getDataManager().getBuildingManager().getBuildings());
});

export default router;