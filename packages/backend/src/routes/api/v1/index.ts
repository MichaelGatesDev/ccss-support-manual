import { Router, Request, Response } from "express";

import buildingsRoute from "./buildings";
import roomsRoute from "./rooms";
import imagesRoute from "./images";
import troubleshootingRoute from "./troubleshooting-data";
import uploadRoute from "./upload";
import backupRoute from "./backup";
import restoreRoute from "./restore";

import { app } from "../../../app";

const router: Router = Router();
router.use("/buildings", buildingsRoute);
router.use("/rooms", roomsRoute);
router.use("/images", imagesRoute);
router.use("/troubleshooting-data", troubleshootingRoute);
router.use("/upload", uploadRoute);
router.use("/backup", backupRoute);
router.use("/restore", restoreRoute);

router.get("/", (_req: Request, res: Response): void => {
  res.send("This is the primary API v1 route");
});

router.get("/save", (_req: Request, res: Response): void => {
  app.dataManager.saveBuildings();
  app.dataManager.saveRooms();
  res.status(200).json({});
});

export default router;