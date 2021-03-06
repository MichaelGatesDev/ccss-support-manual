import { Router, Request, Response } from "express";

import buildingsRoute from "./buildings";
import imagesRoute from "./images";
import troubleshootingRoute from "./troubleshooting-data";
import importRoute from "./import";
import backupRoute from "./backup";
import restoreRoute from "./restore";

import { app } from "../../../app";

const router: Router = Router();
router.use("/buildings", buildingsRoute);
router.use("/images", imagesRoute);
router.use("/troubleshooting-data", troubleshootingRoute);
router.use("/import", importRoute);
router.use("/backup", backupRoute);
router.use("/restore", restoreRoute);

router.get("/", (_req: Request, res: Response): void => {
  res.status(200).send("This is the primary API v1 route");
});

router.get(
  "/save",
  async (_req: Request, res: Response): Promise<void> => {
    await app.dataManager.save();
    res.status(200).json({});
  }
);

router.get(
  "/nuke",
  async (_req: Request, res: Response): Promise<void> => {
    await app.dataManager.nuke();
    res.sendStatus(200);
  }
);

router.get("/rooms", (_req: Request, res: Response): void => {
  res.status(200).json(app.roomManager.getRooms());
});

export default router;
