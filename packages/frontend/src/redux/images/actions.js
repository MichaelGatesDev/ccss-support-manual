"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
function fetchImages() {
    return function (dispatch) {
        fetch('/api/v1/images/')
            .then(response => response.json())
            .then(images => {
            dispatch({
                type: types_1.FETCH_IMAGES,
                payload: images
            });
        }).catch((_error) => {
            console.error("Failed to fetch room images");
        });
    };
}
exports.fetchImages = fetchImages;
;
