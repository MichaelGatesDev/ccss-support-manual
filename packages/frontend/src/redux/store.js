"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redux_1 = require("redux");
const redux_thunk_1 = __importDefault(require("redux-thunk"));
const reducers_1 = require("./buildings/reducers");
const reducers_2 = require("./images/reducers");
const rootReducer = redux_1.combineReducers({
    buildings: reducers_1.buildingsReducer,
    images: reducers_2.imagesReducer
});
const middleware = [redux_thunk_1.default];
exports.store = redux_1.createStore(rootReducer, redux_1.applyMiddleware(...middleware));
