import { Router, Response, Request } from "express";
import { Logger } from "@michaelgatesdev/common";

import { Building } from "@ccss-support-manual/models";
import { app } from "../../../../app";

const router: Router = Router();

router.post("/", async (req: Request, res: Response): Promise<void> => {

    const building: Building | undefined = req.body;
    if (building === undefined) {
        res.status(500).send(`Could not delete building because it does not exist!`);
        Logger.error(`Could not delete building because it does not exist!`);
        return;
    }

    app.buildingManager.removeBuilding(building);

    res.status(200).json(building);
});

export default router;