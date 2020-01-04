import { Router, Request, Response } from "express";
import { Logger } from "@michaelgatesdev/common";

import { BackupRestoreOptions } from "@ccss-support-manual/models";

import { app } from "../../../../app";

const router: Router = Router();

router.get("/", async (_req: Request, res: Response): Promise<void> => {
  res.status(200).json(await app.backupManager.getRestoreOptions());
});

router.post("/", async (req: any, res): Promise<void> => {
  try {
    const options: BackupRestoreOptions | undefined = req.body;
    if (options === undefined) {
      res.status(500).send("No restore options found");
      Logger.error("No restore options found");
      return;
    }
    await app.backupManager.restore(options);
    await app.reinitialize();
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error.message !== undefined ? error.message : error);
    Logger.error(error);
  }
});

export default router;