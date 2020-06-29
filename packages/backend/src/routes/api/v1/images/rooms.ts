import { Router, Response, NextFunction } from "express";
import { app } from "../../../../app";

const router: Router = Router();

router.get("/", (_req, res): void => {
  res.status(200).json(app.imageManager.roomImages);
});

router.param("roomNumber", (req: any, _res: Response, next: NextFunction, roomNumber: string): void => {
  req.roomNumber = roomNumber;
  next();
  // let building = app.buildingManager.getBuildingByName(req.buildingName);
  // if (building !== undefined) {
  //     let room = RoomUtils.getRoomByNumber(building, roomNumber);
  //     if (room !== undefined) {
  //         req.roomNumber = room.number;
  //         next();
  //         return;
  //     }
  // }
  // next(new Error("Failed to find room: " + roomNumber));
  // return;
});

router.get("/:roomNumber", (req: any, res): void => {
  const buildingName = req.buildingName;
  const roomNumber = req.roomNumber;
  const images = app.imageManager.getImagesForRoom(buildingName, roomNumber);
  res.status(200).json(images);
});

export default router;
