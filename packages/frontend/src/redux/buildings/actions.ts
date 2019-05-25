import { Dispatch } from 'redux';
import { FETCH_BUILDINGS, FETCH_BUILDING } from './types';
import { Building } from 'backend/src/building';

import { plainToClass } from "class-transformer";

export function fetchBuildings() {
    return function (dispatch: Dispatch) {
        fetch('/api/v1/buildings')
            .then(response => response.json())
            .then((buildingsJson: Object[]) => {

                plainToClass(Building, buildingsJson);

                dispatch({
                    type: FETCH_BUILDINGS,
                    payload: buildingsJson
                });
            }).catch((error) => {
                console.error("Failed to fetch buildings");
                console.error(error);
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