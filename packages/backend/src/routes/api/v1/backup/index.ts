import { Router, Request, Response } from "express";
import { app, logger } from "../../../../app";
import { BackupRestoreOptions } from "@ccss-support-manual/models";

const router: Router = Router();

router.get(
  "/",
  async (_req: Request, res: Response): Promise<void> => {
    res.status(200).send("This is the primary backup route");
  }
);

router.post(
  "/",
  async (req: any, res): Promise<void> => {
    try {
      const options: BackupRestoreOptions | undefined = req.body;
      if (options === undefined) {
        res.status(500).send("No backup options found");
        logger.error("No backup options found");
        return;
      }
      await app.backupManager.backup(options);
      res.sendStatus(200);
    } catch (error) {
      res.status(500).send(error.message !== undefined ? error.message : error);
      logger.error(error);
    }
  }
);

export default router;
