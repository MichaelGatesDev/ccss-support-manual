import { Router } from "express";
import multer from "multer";
import { SpreadsheetManager, TroubleshootingSpreadsheetImportResult } from "../../../../spreadsheet-manager";
import { SpreadsheetType, SpreadsheetImportMode } from "@ccss-support-manual/models";
import { app } from "../../../../app";
import { Logger, EnumUtils } from "@michaelgatesdev/common";

const router: Router = Router();

const storage = multer.diskStorage({
    filename(_req, file, cb) {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage });


router.post('/', upload.single('file'), async (req, res) => {

    const mode = EnumUtils.parse(SpreadsheetImportMode, req.body.importMode);
    if (mode === undefined) {
        res.status(500).json({});
        return;
    }
    
    const result = await SpreadsheetManager.importSpreadsheet(`${req.file.destination}/${req.file.originalname}`, SpreadsheetType.Troubleshooting, mode) as TroubleshootingSpreadsheetImportResult;

    switch (+mode) {
        default:
            Logger.debug("DEFAULT MODE! " + mode);
            break;
        case SpreadsheetImportMode.Append:
            Logger.debug("Append data");
            Logger.error("NOT SUPPORTED!");
            // app.buildingManager.addBuildings(result.buildings);
            // // add new buildings and rooms
            // const differentRooms = RoomUtils.getDifference(app.roomManager.getRooms(), result.rooms);
            // console.log(`Rooms before filter: ${result.rooms.length} | After filter: ${differentRooms.length}`);
            // app.roomManager.addRooms(differentRooms);
            break;
        case SpreadsheetImportMode.ClearAndWrite:
            Logger.debug("Clear and Write data");
            // clear all buildings and rooms
            app.troubleshootingDataManager.clear();
            // add new buildings and rooms
            app.troubleshootingDataManager.addAll(result.troubleshootingData);
            break;
        case SpreadsheetImportMode.OverwriteAndAppend:
            Logger.debug("Overwrite and Append data");
            Logger.error("NOT SUPPORTED!");
            // // add new buildings and rooms
            // app.buildingManager.addBuildings(result.buildings);
            // app.roomManager.addRooms(result.rooms);
            break;
    }

    await app.imageManager.initialize();

    res.status(200).json({});
});

export default router;