import { Router, Request, Response } from "express";
import { app } from "../../../../app";
import { BackupOptions } from "@ccss-support-manual/models";
import { Logger } from "@michaelgatesdev/common";

const router: Router = Router();

router.get("/", async (_req: Request, res: Response): Promise<void> => {
  res.status(200).send("This is the primary backup route");
});

router.post("/", async (req: any, res): Promise<void> => {
  try {
    const options: BackupOptions | undefined = req.body;
    if (options === undefined) {
      res.status(500).send("No backup options found");
      Logger.error("No backup options found");
      return;
    }
    await app.dataManager.backup(options);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error.message !== undefined ? error.message : error);
    Logger.error(error);
  }
});

export default router;