import { Router, Request, Response, NextFunction } from 'express';
import { app } from '../../../../src/App';

const router: Router = Router();

router.get("/", function (req, res) {
    res.json(app.getDataManager().getImageManager().getAllImages());
});

import buildingsRoute from './buildings';
router.use('/buildings', buildingsRoute);

export = router;