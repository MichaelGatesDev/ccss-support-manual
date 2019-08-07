"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
function fetchBuildings() {
    return function (dispatch) {
        fetch('/api/v1/buildings')
            .then(response => response.json())
            .then((buildingsJson) => {
            dispatch({
                type: types_1.FETCH_BUILDINGS,
                payload: buildingsJson
            });
        }).catch((error) => {
            console.error("Failed to fetch buildings");
            console.error(error);
        });
    };
}
exports.fetchBuildings = fetchBuildings;
