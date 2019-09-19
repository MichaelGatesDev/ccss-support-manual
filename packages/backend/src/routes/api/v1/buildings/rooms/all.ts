import { Router, Response } from "express";
import { app } from "../../../../../app";

const router: Router = Router();

router.get("/", (_req: any, res: Response): void => {
    res.status(200).json(app.roomManager.getRooms());
});

export default router;