import { Router, Response, NextFunction } from "express";
import { app } from "../../../../app";

import all from "./all";
import single from "./single";

import add from "./add";

const router: Router = Router();


router.use("/", all);

router.use("/add", add);

router.param("buildingName", (req: any, _res: Response, next: NextFunction, id: string): void => {
    let building = app.buildingManager.getBuildingByName(id);
    if (building) {
        req.body = { building };
        next();
        return;
    }
    next(new Error(`Could not find a building with the name: ${id}`));
});
router.use("/:buildingName", single);


export default router;
