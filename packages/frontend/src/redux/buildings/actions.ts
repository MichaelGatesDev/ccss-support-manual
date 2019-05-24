import { Dispatch } from 'redux';
import { FETCH_BUILDINGS, FETCH_BUILDING } from './types';
import { Building } from 'backend/src/building';


export function fetchBuildings() {
    return function (dispatch: Dispatch) {
        fetch('/api/v1/buildings')
            .then(response => response.json())
            .then(buildings => {
                dispatch({
                    type: FETCH_BUILDINGS,
                    payload: buildings as Building[]
                })
            }).catch((error) => {
                console.error("Failed to fetch buildings");
            });
    }
};

export function fetchBuilding(buildingName: string) {
    return function (dispatch: Dispatch) {
        fetch('/api/v1/buildings/' + buildingName)
            .then(response => response.json())
            .then(building => {
                dispatch({
                    type: FETCH_BUILDING,
                    payload: building as Building | null
                })
            }).catch((error) => {
                console.error("Failed to fetch buildings");
            });
    }
};