import { Router, Response, Request } from "express";
import { app } from "../../../../app";

const router: Router = Router();

router.get("/", (_req: Request, res: Response): void => {
    res.json(app.buildingManager.buildings);
});

export default router;