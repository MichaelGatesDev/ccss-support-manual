import { Router, Response, NextFunction } from "express";
import { app } from "../../../../app";

const router: Router = Router();


router.get("/", (_req, res): void => {
    res.status(200).json(app.imageManager.buildingImages);
});

router.param("buildingName", (req: any, _res: Response, next: NextFunction, buildingName: string): void => {
    let building = app.buildingManager.getBuildingByName(buildingName);
    if (building) {
        req.building = building;
        next();
        return;
    }
    next(new Error(`Failed to find building: ${buildingName}`));
    return;
});


router.get("/:buildingName", (req: any, res): void => {
    res.status(200).json(app.imageManager.getImagesForBuilding(req.building.internalName));
});

import roomsRoute from "./rooms";
router.use("/:buildingName/rooms", roomsRoute);

export default router;