import { Router, Response } from 'express';

const router: Router = Router();

router.get('/', (req: any, res: Response) => {
    res.json(req.building);
});

import roomsRoute from './rooms';
router.use('/rooms', roomsRoute);

export default router;