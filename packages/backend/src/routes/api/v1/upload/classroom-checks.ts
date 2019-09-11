import { Router } from "express";
import multer from "multer";
import { SpreadsheetManager, ClassroomChecksSpreadsheetImportResult } from "../../../../spreadsheet-manager";
import { SpreadsheetType, SpreadsheetImportMode, ClassroomChecksSpreadsheetVersion } from "@ccss-support-manual/models";

const router: Router = Router();

const storage = multer.diskStorage({
    filename(_req, file, cb) {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage });


router.post('/', upload.single('file'), async (req, res) => {
    const mode = SpreadsheetImportMode[req.body.importMode];
    const version = ClassroomChecksSpreadsheetVersion[req.body.fileVersion];

    console.log(`Importing version ${version} of Classroom Checks Spreadsheet in mode ${mode}`);

    const result = await SpreadsheetManager.importSpreadsheet(`${req.file.destination}/${req.file.originalname}`, SpreadsheetType.ClassroomChecks, SpreadsheetImportMode.Append) as ClassroomChecksSpreadsheetImportResult;
    console.log(`Result: ${result.buildings.length} buildings and ${result.rooms.length} rooms`);
    res.status(200).json({ message: "Hello World" });
});

export default router;