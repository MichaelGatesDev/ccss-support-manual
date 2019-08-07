import { Router, Request, Response } from "express";
import { app } from "../../../../app";

const router: Router = Router();

router.get("/", (_req: Request, res: Response): void => {
    res.json(app.roomManager.getRooms());
});

export default router;