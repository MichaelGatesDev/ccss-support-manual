import { Router, Request, Response } from 'express';

import apiRoute from './api';

const router: Router = Router();

router.use('/api', apiRoute);

// router.get('/', function (req, res, next) {
//   res.send("This is the index page");
// });

export default router;