import { Router, Request, Response } from "express";
import { Logger } from "@michaelgatesdev/common";
import { app } from "../../../../app";

const router: Router = Router();

router.get("/", async (_req: Request, res: Response): Promise<void> => {
  res.status(200).json(await app.dataManager.getRestoreOptions());
});

router.post("/", async (req: Request, res: Response): Promise<void> => {
  const restorePoint: string = req.body.restorePoint;
  if (restorePoint === undefined) {
    res.status(500).send("No restore point found!");
    Logger.error("No restore point found!");
    return;
  }
  try {
    await app.dataManager.restore(restorePoint);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error.message !== undefined ? error.message : error);
    Logger.error(error);
  }
});

export default router;