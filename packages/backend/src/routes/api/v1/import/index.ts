import { Router } from "express";
import { app } from "../../../../app";

import spreadsheetRoute from "./spreadsheet";

const router: Router = Router();

router.get("/", (_req, res): void => {
    res.status(200).send("This is the import route");
});

router.use("/spreadsheet", spreadsheetRoute);

export default router;