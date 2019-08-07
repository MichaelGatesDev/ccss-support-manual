import { Router, Response } from "express";

const router: Router = Router();

router.get("/", (req: any, res: Response): void => {
    res.json(req.building);
});

import roomsRoute from "./rooms";
router.use("/rooms", roomsRoute);

export default router;