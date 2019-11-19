import { Router, Response } from "express";
import { Room } from "@ccss-support-manual/models";
import { Logger } from "@michaelgatesdev/common";

const router: Router = Router();

router.get("/", (req: any, res: Response): void => {
    res.status(200).json(req.body.room as Room);
});

export default router;