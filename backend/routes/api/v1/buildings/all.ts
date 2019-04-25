import { Router, Request, Response, NextFunction } from 'express';
import app from '../../../../App';

const router: Router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.json(app.getDataManager().getBuildingManager().getBuildings);
});

export = router;