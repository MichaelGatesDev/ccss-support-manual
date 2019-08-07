import { Router, Response, NextFunction } from "express";
import { app } from "../../../../app";

const router: Router = Router();


router.get("/", (_req, res): void => {
    res.json(app.troubleshootingDataManager.troubleshootingData);
});

router.param("buildingName", (req: any, _res: Response, next: NextFunction, buildingName: string): void => {
    let building = app.buildingManager.getBuildingByName(buildingName);
    if (building) {
        req.building = building;
        next();
        return;
    }
    next(new Error("Failed to find building: " + buildingName));
    return;
});

router.get("/:buildingName", (_req: any, res): void => {
    res.json({});
    console.warn("This route should not be used.");
});

import roomsRoute from "./rooms";
router.use("/:buildingName/rooms", roomsRoute);

export default router;