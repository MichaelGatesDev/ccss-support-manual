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
        Logger.error(`Updated bnot found.`);
        return;
    }

    const toUpdate: Building | undefined = app.buildingManager.getBuildingByName(building.internalName);
    if (toUpdate === undefined) {
        res.status(500).send(`Building to update not found.`);
        Logger.error(`Building to update not found.`);
        return;
    }

    toUpdate.officialName = updatedBuilding.officialName;
    toUpdate.internalName = updatedBuilding.internalName;

    res.status(200).json();
});

export default router;