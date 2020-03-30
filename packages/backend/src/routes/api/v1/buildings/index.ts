import { Router, Response, NextFunction } from "express";

import { app } from "../../../../app";
import { BuildingRequest } from "../../../../models/building-request";
import all from "./all";
import single from "./single";
import add from "./add";

const router: Router = Router();

router.use("/", all);
router.use("/add", add);
router.param(
  "buildingName",
  (
    req: BuildingRequest,
    _res: Response,
    next: NextFunction,
    buildingName: string
  ): void => {
    const building = app.buildingManager.getBuildingByName(buildingName);
    if (building !== undefined) {
      req.building = building;
      next();
    } else {
      next(
        new Error(`Could not find a building with the name: ${buildingName}`)
      );
    }
  }
);
router.use("/:buildingName", single);

export default router;
