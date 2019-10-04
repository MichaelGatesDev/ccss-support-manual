import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";

import { buildingsReducer } from "./buildings/reducers";
import { roomsReducer } from "./rooms/reducers";
import { imagesReducer } from "./images/reducers";
import { troubleshootingReducer } from "./troubleshooting/reducers";

const rootReducer = combineReducers({
  buildings: buildingsReducer,
  rooms: roomsReducer,
  troubleshooting: troubleshootingReducer,
  images: imagesReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

const middleware = [thunk];

export const store = createStore(
  rootReducer,
  applyMiddleware(...middleware),
);
