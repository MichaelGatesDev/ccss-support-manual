import { Router } from "express";

import apiRoute from "./api";

const router: Router = Router();

router.use("/api", apiRoute);

router.get("/", function (_req, res, _next) {
    res.send("This is the index page");
});

export default router;