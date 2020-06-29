import { Router, Response, Request } from "express";

import { Building } from "@ccss-support-manual/models";

import { app, logger } from "../../../../app";
import roomsRoute from "./rooms";

const router: Router = Router();

router.get("/", (req: any, res: Response): void => {
  res.status(200).json(req.body.building as Building);
});

router.use("/rooms", roomsRoute);
router.post(
  "/update",
  async (req: Request, res: Response): Promise<void> => {
    const building = req.body.building as Building;
    if (building === undefined) {
      res.status(500).send(`Building not found.`);
      logger.error(`Building not found.`);
      return;
    }

    const updatedBuilding = req.body as Building;
    if (updatedBuilding === undefined) {
      res.status(500).send(`Updated building not found.`);
      logger.error(`Updated building not found.`);
      return;
    }

    if (!app.buildingManager.updateBuilding(building, updatedBuilding)) {
      res.status(500).send(`Failed to update building.`);
      logger.error(`Failed to update building.`);
      return;
    }

    res.status(200).json();
  }
);
router.post(
  "/delete",
  async (req: Request, res: Response): Promise<void> => {
    const building: Building | undefined = req.body;
    if (building === undefined) {
      res.status(500).send(`Could not delete building because it does not exist!`);
      logger.error(`Could not delete building because it does not exist!`);
      return;
    }

    app.buildingManager.removeBuilding(building);
    await app.dataManager.save();

    res.status(200).json(building);
  }
);

export default router;
