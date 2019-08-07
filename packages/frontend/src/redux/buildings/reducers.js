"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
const initialState = {
    buildings: [],
    building: null,
    buildingsLoading: true,
};
function buildingsReducer(state = initialState, action) {
    switch (action.type) {
        case types_1.FETCH_BUILDINGS:
            return Object.assign({}, state, { buildings: action.payload, buildingsLoading: false });
        default:
            return state;
    }
}
exports.buildingsReducer = buildingsReducer;
