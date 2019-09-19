import { Router, Response } from "express";

const router: Router = Router();

router.get("/", (req: any, res: Response): void => {
    res.status(200).json(req.room);
});

export default router;