import { Router } from 'express';
import { app } from '../../../../app';

const router: Router = Router();

router.get("/", function (_req, res) {
    const tdm = app.getDataManager().getTroubleshootingDataManager();
    res.json(tdm.getTroubleshootingData());
});

import buildingsRoute from './buildings';
router.use('/buildings', buildingsRoute);

export default router;