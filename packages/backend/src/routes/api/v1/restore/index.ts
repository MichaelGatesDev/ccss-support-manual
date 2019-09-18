import { Router, Request, Response } from "express";
import { app } from "../../../../app";

const router: Router = Router();

router.get("/", async (_req: Request, res: Response): Promise<void> => {
  res.status(200).json(await app.dataManager.getRestoreOptions());
});

router.post("/", (_req: Request, res: Response): void => {
  res.send("This is the primary API v1 route");
});

export default router;