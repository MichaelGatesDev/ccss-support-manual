import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";

import { buildingsReducer } from "./buildings/reducers";
import { roomsReducer } from "./rooms/reducers";
import { imagesReducer } from "./images/reducers";
import { troubleshootingReducer } from "./troubleshooting/reducers";
import { uploadsReducer } from "./uploads/reducers";
import { backupReducer } from "./backup/reducers";
import { restoreReducer } from "./restore/reducers";
import { saveReducer } from "./save/reducers";

const rootReducer = combineReducers({
  buildings: buildingsReducer,
  rooms: roomsReducer,
  troubleshooting: troubleshootingReducer,
  images: imagesReducer,

  uploads: uploadsReducer,
  backup: backupReducer,
  restore: restoreReducer,
  save: saveReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

const middleware = [thunk];

export const store = createStore(
  rootReducer,
  applyMiddleware(...middleware),
);
