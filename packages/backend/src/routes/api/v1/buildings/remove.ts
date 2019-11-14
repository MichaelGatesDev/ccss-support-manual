import { Router, Response, Request } from "express";
import { app } from "../../../../app";

const router: Router = Router();

router.get("/", (req: Request, res: Response): void => {
    res.status(200);
});

export default router;