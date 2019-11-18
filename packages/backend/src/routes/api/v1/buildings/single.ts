import { Router, Response } from "express";

import { Building } from "@ccss-support-manual/models";

import roomsRoute from "./rooms";
import editRoute from "./edit";
import removeRoute from "./remove";

const router: Router = Router();

router.get("/", (req: any, res: Response): void => {
    res.status(200).json(req.body.building as Building);
});

router.use("/rooms", roomsRoute);
router.use("/edit", editRoute);
router.use("/remove", removeRoute);

export default router;