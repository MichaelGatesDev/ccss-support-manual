import { Router, Response, Request } from "express";

import { app } from "../../../../../app";

const router: Router = Router();

router.post(
  "/",
  async (req: Request, res: Response): Promise<void> => {
    // const json: { officialName: string; nicknames: string[] } = req.body;

    // if (
    //   app.buildingManager.getBuildingByName(json.officialName) !== undefined
    // ) {
    //   res
    //     .status(500)
    //     .send(
    //       `Could not create building with the name "${json.officialName}" because a building with that name already exists!`
    //     );
    //   logger.error(
    //     `Could not create building with the name "${json.officialName}" because a building with that name already exists!`
    //   );
    //   return;
    // }

    const created = new RoomFactory().build();

    // app.buildingManager.addBuilding(created);
    app.dataManager.save();

    res.status(200).json(created);
  }
);

export default router;
