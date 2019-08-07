"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
const initialState = {
    images: null,
    imagesLoading: true
};
function imagesReducer(state = initialState, action) {
    switch (action.type) {
        case types_1.FETCH_IMAGES:
            return Object.assign({}, state, { images: action.payload, imagesLoading: false });
        default:
            return state;
    }
}
exports.imagesReducer = imagesReducer;
