import { Router } from "express";
import multer from "multer";
import { Logger, EnumUtils } from "@michaelgatesdev/common";
import { GoogleDriveDownloader, FileUtils } from "@michaelgatesdev/common-io";

import { SpreadsheetUtils } from "@ccss-support-manual/utilities";
import { SpreadsheetType, SpreadsheetImportMode } from "@ccss-support-manual/models";

import { SpreadsheetManager } from "../../../../spreadsheet-manager";
import { app } from "../../../../app";

const router: Router = Router();

const storage = multer.diskStorage({
    filename(_req, file, cb) {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage });

router.get('/', (req, res) => {
    res.status(200).send("Hello World");
});

router.post('/', upload.single('file'), async (req, res) => {

    let file: string | Express.Multer.File | undefined = undefined;

    const url: string = req.body.url;
    const downloadPath = `${app.DOWNLOADS_DIR}/download.tmp`;
    if (url !== undefined) {
        const strippedID = SpreadsheetUtils.stripGoogleID(url);
        if (strippedID == undefined) {
            res.status(500).send("The specified URL is not a valid Google Docs URL.");
            Logger.error("The specified URL is not a valid Google Docs URL.");
            return;
        }
        Logger.debug(`Downloading from ${url} (${strippedID})`);
        try {
            const result = await GoogleDriveDownloader.downloadSpreadsheet(
                strippedID,
                "xlsx",
                downloadPath,
                true,
            );
            if (!result) {
                res.status(500).send("There was an error downloading the file.");
                Logger.error(`There was an error downloading the file.`);
                return;
            }
            Logger.debug(`Download complete`);
            file = downloadPath;
        } catch (error) {
            res.status(500).send(error.message !== undefined ? error.message : error);
            Logger.error(error);
        }
    }

    // if no download occurred
    if (file === undefined) {
        file = req.file;
    }

    const path = typeof file === "string" ? file : `${req.file.destination}/${req.file.originalname}`;

    const importType = EnumUtils.parse(SpreadsheetType, req.body.importType);
    if (importType === undefined) {
        res.status(500).send(`Could not parse import type ${req.body.importType}`);
        Logger.error(`Could not parse import type ${req.body.importType}`);
        return;
    }
    Logger.debug(`Parsed import type as ${SpreadsheetType[importType]}`);

    const importMode = EnumUtils.parse(SpreadsheetImportMode, req.body.importMode);
    if (importMode === undefined) {
        res.status(500).send(`Could not parse import type ${req.body.importMode}`);
        Logger.error(`Could not parse import type ${req.body.importMode}`);
        return;
    }
    Logger.debug(`Parsed import mode as ${SpreadsheetImportMode[importMode]}`);

    try {
        Logger.debug("Performing import...");
        await SpreadsheetManager.importSpreadsheet(path, importType, importMode);
        app.dataManager.save(); // TODO confirm
        Logger.debug("Import complete!");
        res.sendStatus(200);
    } catch (error) {
        res.status(500).send(error.message !== undefined ? error.message : error);
        Logger.error(error);
        return;
    } finally {
        await FileUtils.delete(path);
        Logger.debug(`Deleted downloaded file at ${path}`);
    }
});

export default router;