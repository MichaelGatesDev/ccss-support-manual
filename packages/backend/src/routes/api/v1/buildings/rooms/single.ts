import { Router, Response } from 'express';

const router: Router = Router();

router.get('/', function (req: any, res: Response) {
    res.json(req.room);
});

export default router;