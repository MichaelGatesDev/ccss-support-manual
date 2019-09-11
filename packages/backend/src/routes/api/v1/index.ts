import { Router, Request, Response } from "express";

import buildingsRoute from "./buildings";
import roomsRoute from "./rooms";
import imagesRoute from "./images";
import troubleshootingRoute from "./troubleshooting-data";
import uploadRoute from "./upload";

const router: Router = Router();
router.use("/buildings/", buildingsRoute);
router.use("/rooms/", roomsRoute);
router.use("/images/", imagesRoute);
router.use("/troubleshooting-data/", troubleshootingRoute);
router.use("/upload/", uploadRoute);


router.get("/", (_req: Request, res: Response): void => {
  res.send("This is the primary API v1 route");
});


/*
router.get("/getbuilding", function (req: Request, res: Response, next: NextFunction) {

  if (!req.query.roomID) {
    res.send("You must specify a room ID");
    return;
  }

  res.json(app.getDataManager().getRoomManager().getRoomByID(req.query.roomID));
});
*/

export default router;