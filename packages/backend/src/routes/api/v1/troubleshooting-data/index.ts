import { Router } from "express";

import { app } from "../../../../app";

import buildingsRoute from "./buildings";

const router: Router = Router();

router.get("/", (_req, res): void => {
    res.status(200).json(app.troubleshootingDataManager.troubleshootingData);
});

router.use("/buildings", buildingsRoute);

export default router;