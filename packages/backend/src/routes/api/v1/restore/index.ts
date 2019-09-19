import { Router, Request, Response } from "express";
import { app } from "../../../../app";

const router: Router = Router();

router.get("/", async (_req: Request, res: Response): Promise<void> => {
  res.status(200).json(await app.dataManager.getRestoreOptions());
});

router.post("/", async (req: Request, res: Response): Promise<void> => {
  const { body } = req;
  return new Promise(async (resolve, reject) => {
    try {
      const { restorePoint } = body;
      await app.dataManager.restore(restorePoint);
      res.status(200).json();
      return resolve();
    } catch (error) {
      res.status(400);
      return reject(error);
    }
  });
});

export default router;