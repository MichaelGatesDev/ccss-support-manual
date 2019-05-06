import { Router, Request, Response, NextFunction } from 'express';

const router: Router = Router();

router.get('/', function (req: any, res: Response, next: NextFunction) {
    res.json(req.room);
});

export = router;