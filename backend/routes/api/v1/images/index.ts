import { Router, Request, Response, NextFunction } from 'express';
import app from '../../../../App';
import { Building } from '../../../../models/Building';

const router: Router = Router();

router.get("/", function (req, res) {
    res.json(app.getDataManager().getImageManager().getImages());
});


router.param('buildingID', function (req: any, res: Response, next: NextFunction, id: string) {
    let building = app.getDataManager().getBuildingManager().getBuildingByName(id);
    if (building) {
        req.building = building;
        next();
        return;
    }
    next(new Error('Failed to find building: ' + id));
    return;
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

router.param('roomID', function (req: any, res: Response, next: NextFunction, id: string) {
    for (const room of app.getDataManager().getRoomManager().getRooms()) {
        if (room.getID() == id) {
            req.room = room;
            next();
            return;
        }
    }
    next(new Error('Failed to find room: ' + id));
    return;
});

router.get("/:buildingID/:roomID", function (req, res) {
    //TODO this
    // res.json(app.getDataManager().getImageManager().getImagesFor());
});


router.get('/:roomID', function (req: any, res: Response) {
    res.json(app.getDataManager().getImageManager().getImagesForRoom(req.room));
});

export = router;