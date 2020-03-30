import { Router } from "express";
import { app } from "../../../../app";

import buildingsRoute from "./buildings";

const router: Router = Router();

router.get("/", (_req, res): void => {
  res.status(200).json(app.imageManager.getAllImages());
});

router.use("/buildings", buildingsRoute);

export default router;
