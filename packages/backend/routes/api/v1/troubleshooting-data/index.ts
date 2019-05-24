import { Router, Request, Response, NextFunction } from 'express';
import { app } from '../../../../src/app';

const router: Router = Router();

router.get("/", function (req, res) {
    const tdm = app.getDataManager().getTroubleshootingDataManager();
    res.json(tdm.getTroubleshootingData());
});

import buildingsRoute from './buildings';
router.use('/buildings', buildingsRoute);

export default router;