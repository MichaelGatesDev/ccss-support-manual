import { Dispatch } from "redux";
import { Room } from "@ccss-support-manual/models";
import {
  REQUEST_FETCH_ROOMS,
  REQUEST_FETCH_ROOMS_FAILURE,
  REQUEST_FETCH_ROOMS_SUCCESS,
  REQUEST_FETCH_ROOM,
  REQUEST_FETCH_ROOM_FAILURE,
  REQUEST_FETCH_ROOM_SUCCESS,
} from "./types";

export const fetchRooms = (buildingName?: string) => async (
  dispatch: Dispatch
) => {
  dispatch({
    type: REQUEST_FETCH_ROOMS,
  });
  try {
    const response = await fetch(
      buildingName !== undefined
        ? `http://localhost:3001/api/v1/buildings/${buildingName}/rooms/`
        : "http://localhost:3001/api/v1/rooms"
    );
    // Bad response (error)
    if (!response.ok) {
      const error = await response.text();
      dispatch({
        type: REQUEST_FETCH_ROOMS_FAILURE,
        error,
      });
      return;
    }

    const json = await response.json();
    dispatch({
      type: REQUEST_FETCH_ROOMS_SUCCESS,
      data: json as Room[],
    });
  } catch (error) {
    dispatch({
      type: REQUEST_FETCH_ROOMS_FAILURE,
      error,
    });
  }
};

export const fetchRoom = (
  buildingName: string,
  roomNumber: string | number
) => async (dispatch: Dispatch) => {
  dispatch({
    type: REQUEST_FETCH_ROOM,
  });
  try {
    const response = await fetch(
      `http://localhost:3001/api/v1/buildings/${buildingName}/rooms/${roomNumber}`
    );
    // Bad response (error)
    if (!response.ok) {
      const error = await response.text();
      dispatch({
        type: REQUEST_FETCH_ROOM_FAILURE,
        error,
      });
      return;
    }

    const json = await response.json();
    dispatch({
      type: REQUEST_FETCH_ROOM_SUCCESS,
      data: json as Room,
    });
  } catch (error) {
    dispatch({
      type: REQUEST_FETCH_ROOM_FAILURE,
      error,
    });
  }
};
