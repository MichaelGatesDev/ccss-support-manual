import { Dispatch } from "redux";
import { Building } from "@ccss-support-manual/models";

import { FETCH_BUILDINGS } from "./types";

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
