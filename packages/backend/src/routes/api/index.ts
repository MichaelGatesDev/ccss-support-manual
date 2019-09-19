import { Router } from "express";

import v1route from "./v1";

const router: Router = Router();

router.use("/v1", v1route);

router.get("/", (_req, res): void => {
    res.status(200).send("This is the primary API route");
});

export default router;