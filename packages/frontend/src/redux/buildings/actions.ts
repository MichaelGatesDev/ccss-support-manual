import { Dispatch } from "redux";
import { Building } from "@ccss-support-manual/models";

import {
  REQUEST_FETCH_BUILDING,
  REQUEST_FETCH_BUILDING_SUCCESS,
  REQUEST_FETCH_BUILDING_FAILURE,
  REQUEST_FETCH_BUILDINGS,
  REQUEST_FETCH_BUILDINGS_SUCCESS,
  REQUEST_FETCH_BUILDINGS_FAILURE,
  REQUEST_ADD_BUILDING,
  REQUEST_ADD_BUILDING_FAILURE,
  REQUEST_ADD_BUILDING_SUCCESS,
  REQUEST_UPDATE_BUILDING,
  REQUEST_UPDATE_BUILDING_FAILURE,
  REQUEST_UPDATE_BUILDING_SUCCESS,
  REQUEST_REMOVE_BUILDING,
  REQUEST_REMOVE_BUILDING_FAILURE,
  REQUEST_REMOVE_BUILDING_SUCCESS,
} from "./types";

export const fetchBuilding = (name: string) => async (dispatch: Dispatch) => {
  dispatch({
    type: REQUEST_FETCH_BUILDING,
  });
  try {
    const response = await fetch(
      `http://localhost:3001/api/v1/buildings/${name}`
    );
    // Bad response (error)
    if (!response.ok) {
      const error = await response.text();
      dispatch({
        type: REQUEST_FETCH_BUILDING_FAILURE,
        error,
      });
      return;
    }

    const json = await response.json();
    dispatch({
      type: REQUEST_FETCH_BUILDING_SUCCESS,
      data: json as Building,
    });
  } catch (error) {
    dispatch({
      type: REQUEST_FETCH_BUILDING_FAILURE,
      error,
    });
  }
};

export const fetchBuildings = () => async (dispatch: Dispatch) => {
  dispatch({
    type: REQUEST_FETCH_BUILDINGS,
  });
  try {
    const response = await fetch("http://localhost:3001/api/v1/buildings/");
    // Bad response (error)
    if (!response.ok) {
      const error = await response.text();
      dispatch({
        type: REQUEST_FETCH_BUILDINGS_FAILURE,
        error,
      });
      return;
    }

    const json = await response.json();
    dispatch({
      type: REQUEST_FETCH_BUILDINGS_SUCCESS,
      data: json as Building[],
    });
  } catch (error) {
    dispatch({
      type: REQUEST_FETCH_BUILDINGS_FAILURE,
      error,
    });
  }
};

export const addBuilding = (
  officialName: string,
  nicknames: string[]
) => async (dispatch: Dispatch) => {
  dispatch({
    type: REQUEST_ADD_BUILDING,
  });
  try {
    const response = await fetch("http://localhost:3001/api/v1/buildings/add", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ officialName, nicknames }),
    });

    // Bad response (error)
    if (!response.ok) {
      const error = await response.text();
      dispatch({
        type: REQUEST_ADD_BUILDING_FAILURE,
        error,
      });
      return;
    }

    const created: Building = await response.json();

    // Success response
    dispatch({
      type: REQUEST_ADD_BUILDING_SUCCESS,
      data: created,
    });
  } catch (error) {
    dispatch({
      type: REQUEST_ADD_BUILDING_FAILURE,
      error,
    });
  }
};

export const updateBuilding = (
  building: Building,
  newProperties: Building
) => async (dispatch: Dispatch) => {
  dispatch({
    type: REQUEST_UPDATE_BUILDING,
  });
  try {
    const response = await fetch(
      `http://localhost:3001/api/v1/buildings/${building.internalName}/update`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(newProperties), // TODO
      }
    );

    // Bad response (error)
    if (!response.ok) {
      const error = await response.text();
      dispatch({
        type: REQUEST_UPDATE_BUILDING_FAILURE,
        error,
      });
      return;
    }

    // Success response
    // TODO implement return data
    dispatch({
      type: REQUEST_UPDATE_BUILDING_SUCCESS,
      data: undefined,
    });
  } catch (error) {
    dispatch({
      type: REQUEST_UPDATE_BUILDING_FAILURE,
      error,
    });
  }
};

export const removeBuilding = (buildingName: string) => async (
  dispatch: Dispatch
) => {
  dispatch({
    type: REQUEST_REMOVE_BUILDING,
  });
  try {
    const response = await fetch(
      `http://localhost:3001/api/v1/buildings/${buildingName}/remove`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
      }
    );

    // Bad response (error)
    if (!response.ok) {
      const error = await response.text();
      dispatch({
        type: REQUEST_REMOVE_BUILDING_FAILURE,
        error,
      });
      return;
    }

    // Success response
    // TODO implement return data
    dispatch({
      type: REQUEST_REMOVE_BUILDING_SUCCESS,
      data: undefined,
    });
  } catch (error) {
    dispatch({
      type: REQUEST_REMOVE_BUILDING_FAILURE,
      error,
    });
  }
};
