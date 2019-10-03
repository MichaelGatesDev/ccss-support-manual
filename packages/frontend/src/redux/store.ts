import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";

import { buildingsReducer } from "./buildings/reducers";
import { roomsReducer } from "./rooms/reducers";
import { imagesReducer } from "./images/reducers";

const rootReducer = combineReducers({
  buildings: buildingsReducer,
  rooms: roomsReducer,
  images: imagesReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

const middleware = [thunk];

export const store = createStore(
  rootReducer,
  applyMiddleware(...middleware),
);
