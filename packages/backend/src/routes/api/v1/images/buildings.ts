import { Router, Response, NextFunction } from "express";
import { app } from "../../../../app";

import roomsRoute from "./rooms";

const router: Router = Router();

router.get("/", (_req, res): void => {
  res.status(200).json(app.imageManager.buildingImages);
});

router.param(
  "buildingName",
  (
    req: any,
    _res: Response,
    next: NextFunction,
    buildingName: string
  ): void => {
    req.buildingName = buildingName;
    next();
    // let building = app.buildingManager.getBuildingByName(buildingName);
    // if (building) {
    //     req.buildingName = building.internalName;
    //     next();
    //     return;
    // }
    // next(new Error(`Failed to find building: ${buildingName}`));
    // return;
  }
);

router.get("/:buildingName", (req: any, res): void => {
  res.status(200).json(app.imageManager.getImagesForBuilding(req.buildingName));
});

router.use("/:buildingName/rooms", roomsRoute);

export default router;
