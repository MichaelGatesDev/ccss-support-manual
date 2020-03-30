import { Router, Response } from "express";

import { BuildingRoomRequest } from "../../../../../models/building-room-request";

const router: Router = Router();

router.get("/", (req: BuildingRoomRequest, res: Response): void => {
  const building = req.building!;
  res.status(200).json(building.rooms);
});

export default router;
