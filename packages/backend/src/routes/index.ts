import { Router } from "express";

import apiRoute from "./api";

const router: Router = Router();

router.use("/api", apiRoute);

router.get("/", (_req, res): void => {
    res.send("This is the index page");
});

export default router;