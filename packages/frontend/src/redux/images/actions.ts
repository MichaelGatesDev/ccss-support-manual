import { Dispatch } from 'redux';
import { FETCH_IMAGES } from './types';

export function fetchImages() {
    return function (dispatch: Dispatch) {
        fetch('/api/v1/images/')
            .then(response => response.json())
            .then(images => {
                dispatch({
                    type: FETCH_IMAGES,
                    payload: images
                });
            }).catch((_error) => {
                console.error("Failed to fetch room images");
            });
    }
};