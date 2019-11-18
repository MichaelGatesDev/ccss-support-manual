import { Router, Response } from "express";
import { Building } from "@ccss-support-manual/models";

const router: Router = Router();

router.get("/", (req: any, res: Response): void => {
    const building = req.body.building as Building;
    res.status(200).json(building.rooms);
});

export default router;