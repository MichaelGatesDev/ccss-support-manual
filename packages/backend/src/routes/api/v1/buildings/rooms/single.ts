import { Router, Response } from "express";
import { BuildingRoomRequest } from "packages/backend/src/models/building-room-request";

const router: Router = Router();

router.get("/", (req: BuildingRoomRequest, res: Response): void => {
  res.status(200).json(req.room);
});

export default router;
