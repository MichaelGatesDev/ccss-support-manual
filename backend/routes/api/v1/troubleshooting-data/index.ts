import { Router, Request, Response, NextFunction } from 'express';
import { Building } from '../../../../models/Building';
import { app } from '../../../../App';

const router: Router = Router();

router.get("/", function (req, res) {
    const tdm = app.getDataManager().getTroubleshootingDataManager();
    res.json(tdm.getTroubleshootingData());
});

import buildingsRoute from './buildings';
router.use('/buildings', buildingsRoute);

export = router;