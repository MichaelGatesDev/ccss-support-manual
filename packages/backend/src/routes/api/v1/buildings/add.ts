import { Router, Response, Request } from "express";
import { app } from "../../../../app";
import { BuildingFactory } from "@ccss-support-manual/models";
import { StringUtils, Logger } from "@michaelgatesdev/common";

const router: Router = Router();

router.get("/", (req: Request, res: Response): void => {
    res.status(200).send();
});

router.post("/", async (req: Request, res: Response): Promise<void> => {

    const json: { officialName: string; nicknames: string[] } = req.body;

    if (StringUtils.isBlank(json.officialName)) {
        res.status(500).send(`Could not create building with a blank name!`);
        Logger.error(`Could not create building with a blank name!`);
        return;
    }

    if (app.buildingManager.getBuildingByName(json.officialName) !== undefined) {
        res.status(500).send(`Could not create building with the name ${json.officialName} building with that name already exists!`);
        Logger.error(`Could not create building with the name ${json.officialName} building with that name already exists!`);
        return;
    }

    const created = new BuildingFactory()
        .withOfficialName(json.officialName)
        .withNicknames(json.nicknames)
        .withInternalName(StringUtils.internalize(json.officialName))
        .withRooms([])
        .build();

    app.buildingManager.addBuilding(created);
    //TODO save

    res.status(200).json(created);
});

export default router;