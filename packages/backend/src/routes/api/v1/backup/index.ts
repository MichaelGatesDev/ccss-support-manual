import { Router, Request, Response } from "express";
import { app } from "../../../../app";

const router: Router = Router();

router.get("/", async (_req: Request, res: Response): Promise<void> => {
  await app.dataManager.backup();
  res.status(200).json({});
});

router.post("/", (_req: Request, res: Response): void => {
  res.send("This is the primary API v1 route");
});

export default router;