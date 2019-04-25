import { Router, Request, Response, NextFunction } from 'express';
import app from '../../../../App';

const router: Router = Router();

router.get('/', (req, res) => {
    res.json(app.getDataManager().getTroubleshootingDataManager().getTroubleshootingData());
});

export = router;