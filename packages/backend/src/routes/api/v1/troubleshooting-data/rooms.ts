import { Router, Response, NextFunction } from "express";

import { app } from "../../../../app";

const router: Router = Router();

router.get("/", (_req, res): void => {
  res.status(403).json({});
  console.warn("This route should not be used.");
});

router.param(
  "roomNumber",
  (
    req: any,
    _res: Response,
    next: NextFunction,
    roomNumber: string | number
  ): void => {
    req.roomNumber = roomNumber;
    next();
    return;
  }
);

router.get("/:roomNumber", (req: any, res): void => {
  const buildingName = req.buildingName;
  const roomNumber = req.roomNumber;
  const data = app.troubleshootingDataManager.getTroubleshootingDataForRoom(
    buildingName,
    roomNumber
  );
  res.status(200).json(data);
});

export default router;
