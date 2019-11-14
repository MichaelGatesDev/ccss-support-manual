import { Router, Response, NextFunction } from "express";
import { app } from "../../../../app";

import all from "./all";
import single from "./single";

import add from "./add";
import edit from "./edit";
import remove from "./remove";


const router: Router = Router();

router.use("/add", add);
router.use("/edit", edit);
router.use("/remove", remove);

router.param("buildingName", (req: any, _res: Response, next: NextFunction, id: string): void => {
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
