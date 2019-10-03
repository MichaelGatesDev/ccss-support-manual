import { Router } from "express";
import { app } from "../../../../app";

import classroomChecksRoute from "./classroom-checks";
import troubleshootingDataRoute from "./troubleshooting-data";

const router: Router = Router();

router.get("/", (_req, res): void => {
    res.status(200).json(app.imageManager.getAllImages());
});

router.use("/classroom-checks", classroomChecksRoute);
router.use("/troubleshooting-data", troubleshootingDataRoute);

export default router;