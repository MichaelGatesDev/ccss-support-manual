import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import { buildingsReducer } from "./buildings/reducers";
import { imagesReducer } from "./images/reducers";

const rootReducer = combineReducers({
    buildings: buildingsReducer,
    images: imagesReducer
});

export type AppState = ReturnType<typeof rootReducer>;

const middleware = [thunk];

export const store = createStore(
    rootReducer,
    applyMiddleware(...middleware)
);

