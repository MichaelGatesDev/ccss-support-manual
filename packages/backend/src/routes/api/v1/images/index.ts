import { Router } from "express";
import { app } from "../../../../app";

const router: Router = Router();

router.get("/", (_req, res): void => {
    res.json(app.imageManager.getAllImages());
});

import buildingsRoute from "./buildings";
router.use("/buildings", buildingsRoute);

export default router;