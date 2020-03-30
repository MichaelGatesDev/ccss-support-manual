import { Router, Response, NextFunction } from "express";

import roomsRoute from "./rooms";

const router: Router = Router();

router.get("/", (_req, res): void => {
  res.status(403).json({});
});

router.param(
  "buildingName",
  (
    req: any,
    _res: Response,
    next: NextFunction,
    buildingName: string
  ): void => {
    req.buildingName = buildingName;
    next();
  }
);

router.get("/:buildingName", (_req: any, res): void => {
  res.status(403).json({});
});

router.use("/:buildingName/rooms", roomsRoute);

export default router;
