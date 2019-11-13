import { Router, Response, NextFunction } from "express";
import { app } from "../../../../app";

import all from "./all";
import single from "./single";

const router: Router = Router();

router.param("buildingName", (req: any, _res: Response, next: NextFunction, id: string): void => {
    if (id === "add" || id === "edit" || id === "remove") return; //TODO make this better
    let building = app.buildingManager.getBuildingByName(id);
    if (building) {
        req.building = building;
        next();
        return;
    }
    next(new Error("Failed to find building: " + id));
});

router.use("/", all);

router.use("/:buildingName", single);

export default router;