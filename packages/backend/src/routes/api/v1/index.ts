import { Router, Request, Response, NextFunction } from 'express';

const router: Router = Router();


import buildingsRoute from './buildings';
router.use('/buildings/', buildingsRoute);

import roomsRoute from './rooms';
router.use('/rooms/', roomsRoute);

import imagesRoute from './images';
router.use('/images/', imagesRoute);

import troubleshootingRoute from './troubleshooting-data';
router.use('/troubleshooting-data/', troubleshootingRoute);


router.get('/', function (_req: Request, res: Response, _next: NextFunction) {
  res.send("This is the primary API v1 route");
});


/*
router.get('/getbuilding', function (req: Request, res: Response, next: NextFunction) {

  if (!req.query.roomID) {
    res.send("You must specify a room ID");
    return;
  }

  res.json(app.getDataManager().getRoomManager().getRoomByID(req.query.roomID));
});
*/

export default router;