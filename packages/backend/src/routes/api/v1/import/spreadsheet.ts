import { Router } from "express";
import multer from "multer";
import { EnumUtils } from "@michaelgatesdev/common";
import { GoogleDriveDownloader, FileUtils } from "@michaelgatesdev/common-io";

import { SpreadsheetUtils } from "@ccss-support-manual/utilities";
import { SpreadsheetType, SpreadsheetImportMode } from "@ccss-support-manual/models";

import { app, logger } from "../../../../app";

const router: Router = Router();

const storage = multer.diskStorage({
  filename(_req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

router.get("/", (req, res) => {
  res.status(200).send("Hello World");
});

router.post("/", upload.single("file"), async (req, res) => {
  let file: string | Express.Multer.File | undefined = undefined;

  const url: string = req.body.url;
  const downloadPath = `${app.DOWNLOADS_DIR}/download.tmp`;
  if (url !== undefined) {
    const strippedID = SpreadsheetUtils.stripGoogleID(url);
    if (strippedID == undefined) {
      res.status(500).send("The specified URL is not a valid Google Docs URL.");
      logger.error("The specified URL is not a valid Google Docs URL.");
      return;
    }
    logger.debug(`Downloading from ${url} (${strippedID})`);
    try {
      const result = await GoogleDriveDownloader.downloadSpreadsheet(strippedID, "xlsx", downloadPath, true);
      if (!result) {
        res.status(500).send("There was an error downloading the file.");
        logger.error(`There was an error downloading the file.`);
        return;
      }
      logger.debug(`Download complete`);
      file = downloadPath;
    } catch (error) {
      res.status(500).send(error.message !== undefined ? error.message : error);
      logger.error(error);
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
    logger.error(`Could not parse import type ${req.body.importType}`);
    return;
  }
  logger.debug(`Parsed import type as ${SpreadsheetType[importType]}`);

  const importMode = EnumUtils.parse(SpreadsheetImportMode, req.body.importMode);
  if (importMode === undefined) {
    res.status(500).send(`Could not parse import type ${req.body.importMode}`);
    logger.error(`Could not parse import type ${req.body.importMode}`);
    return;
  }
  logger.debug(`Parsed import mode as ${SpreadsheetImportMode[importMode]}`);

  try {
    logger.debug("Performing import...");
    // await app.spreadsheetManager.importSpreadsheet(
    //   path,
    //   importType,
    //   importMode
    // );
    app.dataManager.save(); // TODO confirm
    logger.debug("Import complete!");
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error.message !== undefined ? error.message : error);
    logger.error(error);
    return;
  } finally {
    await FileUtils.delete(path);
    logger.debug(`Deleted downloaded file at ${path}`);
  }
});

export default router;
