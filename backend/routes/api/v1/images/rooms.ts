import { Router, Request, Response, NextFunction } from 'express';
import { app } from '../../../../src/App';
import { Building } from '../../../../models/Building';

const router: Router = Router();


router.get("/", function (req, res) {
    res.json(app.getDataManager().getImageManager().getRoomImages());
});

router.param('roomNumber', function (req: any, res: Response, next: NextFunction, id: string) {
    let building: Building = req.building;
    let room = building.getRoom(id);
    if (room) {
        req.room = room;
        next();
        return;
    }
    next(new Error('Failed to find room: ' + id));
    return;
});

router.get("/:roomNumber", function (req: any, res) {
    res.json(app.getDataManager().getImageManager().getImagesForRoom(req.building.internalName, req.room.number));
});

export = router;