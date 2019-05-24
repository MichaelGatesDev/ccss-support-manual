import { Router, Request, Response, NextFunction } from 'express';

const router: Router = Router();

router.get('/', (req: any, res: Response, next: NextFunction) => {
    res.json(req.building);
});

import roomsRoute from './rooms';
router.use('/rooms', roomsRoute);

export default router;