import { Router, Response, Request } from "express";
import { StringUtils, Logger } from "@michaelgatesdev/common";

import { BuildingFactory } from "@ccss-support-manual/models";

import { app } from "../../../../app";
import { RoomAddBody } from "../../../../models/room-add-request";

const router: Router = Router();

router.get("/", (req: Request, res: Response): void => {
  res.status(200).send();
});

router.post(
  "/",
  async (req: Request, res: Response): Promise<void> => {
    const body: RoomAddBody = req.body;

    if (StringUtils.isBlank(body.officialName)) {
      res.status(500).send(`Could not create building with a blank name!`);
      Logger.error(`Could not create building with a blank name!`);
      return;
    }

    if (
      app.buildingManager.getBuildingByName(body.officialName) !== undefined
    ) {
      res
        .status(500)
        .send(
          `Could not create building with the name "${body.officialName}" because a building with that name already exists!`
        );
      Logger.error(
        `Could not create building with the name "${body.officialName}" because a building with that name already exists!`
      );
      return;
    }

    const nicknames = body.nicknames.filter(
      nickname => !StringUtils.isBlank(nickname)
    );

    const created = new BuildingFactory()
      .withOfficialName(StringUtils.capitalizeFirstLetter(body.officialName))
      .withNicknames(nicknames.map(nick => nick.toLowerCase()))
      .withInternalName(StringUtils.internalize(body.officialName))
      .withRooms([])
      .build();

    app.buildingManager.addBuilding(created);
    app.dataManager.save();

    res.status(200).json(created);
  }
);

export default router;
