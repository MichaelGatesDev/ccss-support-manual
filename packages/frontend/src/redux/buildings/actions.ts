import { Dispatch } from 'redux';
import { FETCH_BUILDINGS } from './types';

export function fetchBuildings() {
    return function (dispatch: Dispatch) {
        fetch('/api/v1/buildings')
            .then(response => response.json())
            .then((buildingsJson: Object[]) => {
                dispatch({
                    type: FETCH_BUILDINGS,
                    payload: buildingsJson
                });
            }).catch((error) => {
                console.error("Failed to fetch buildings");
                console.error(error);
            });
    }
}