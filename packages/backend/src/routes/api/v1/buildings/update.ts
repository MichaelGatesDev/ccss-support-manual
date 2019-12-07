import { Router, Response, Request } from "express";
import { Logger } from "@michaelgatesdev/common";
import { Building } from "@ccss-support-manual/models";
import { app } from "../../../../app";


const router: Router = Router();

router.get("/", (req: Request, res: Response): void => {
    res.status(200);
});

router.post("/", async (req: Request, res: Response): Promise<void> => {

    const building = req.body.building as Building;
    if (building === undefined) {
        res.status(500).send(`Building not found.`);
        Logger.error(`Building not found.`);
        return;
    }

    const updatedBuilding = req.body as Building;
    if (updatedBuilding === undefined) {
        res.status(500).send(`Updated building not found.`);
        Logger.error(`Updated building not found.`);
        return;
    }

    if (!app.buildingManager.updateBuilding(building, updatedBuilding)) {
        res.status(500).send(`Failed to update building.`);
        Logger.error(`Failed to update building.`);
        return;
    }

    res.status(200).json();
});

export default router;