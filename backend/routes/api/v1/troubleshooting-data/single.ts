import { Router, Request, Response, NextFunction } from 'express';

const router: Router = Router();

router.get('/', (req: any, res: Response, next: NextFunction) => {
    res.json(req.troubleshootingData);
});

export = router;