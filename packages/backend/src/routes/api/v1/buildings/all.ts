import { Router, Response } from "express";
import { app } from "../../../../app";

const router: Router = Router();

router.get("/", (res: Response): void => {
    res.json(app.buildingManager.buildings);
});

export default router;