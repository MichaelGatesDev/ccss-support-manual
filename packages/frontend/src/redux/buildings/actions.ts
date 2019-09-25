import { Dispatch } from "redux";
import { Building } from "@ccss-support-manual/models";

import { FETCH_BUILDINGS, FETCH_BUILDING } from "./types";

export function fetchBuildings() {
  return (dispatch: Dispatch) => {
    fetch("/api/v1/buildings")
      .then(response => response.json())
      .then((buildings: Building[]) => {
        dispatch({
          type: FETCH_BUILDINGS,
          payload: buildings,
        });
      }).catch(error => {
        console.error("Failed to fetch buildings");
        console.error(error);
      });
  };
}

export function fetchBuilding(buildingName: string) {
  return (dispatch: Dispatch) => {
    fetch(`/api/v1/buildings/${buildingName}`)
      .then(response => response.json())
      .then((building: Building) => {
        dispatch({
          type: FETCH_BUILDING,
          payload: building,
        });
      }).catch(error => {
        console.error(`Failed to fetch building: ${buildingName}`);
        console.error(error);
      });
  };
}
