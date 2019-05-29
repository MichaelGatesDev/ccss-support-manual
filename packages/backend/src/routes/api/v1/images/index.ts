import { Router } from 'express';
import { app } from '../../../../app';

const router: Router = Router();

router.get("/", function (_req, res) {
    res.json(app.getDataManager().getImageManager().getAllImages());
});

import buildingsRoute from './buildings';
router.use('/buildings', buildingsRoute);

export default router;