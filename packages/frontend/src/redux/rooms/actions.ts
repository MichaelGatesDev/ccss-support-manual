import { Dispatch } from "redux";
import { Room } from "@ccss-support-manual/models";

import { FETCH_ROOMS, FETCH_ROOM } from "./types";

export function fetchRooms() {
  return (dispatch: Dispatch) => {
    fetch("/api/v1/rooms")
      .then((response) => response.json())
      .then((rooms: Room[]) => {
        dispatch({
          type: FETCH_ROOMS,
          payload: rooms,
        });
      }).catch((error) => {
        console.error("Failed to fetch rooms");
        console.error(error);
      });
  };
}

export function fetchRoom(buildingName: string, roomNumber: string | number) {
  return (dispatch: Dispatch) => {
    fetch(`/api/v1/buildings/${buildingName}/rooms/${roomNumber}`)
      .then((response) => response.json())
      .then((room: Room) => {
        dispatch({
          type: FETCH_ROOM,
          payload: room,
        });
      }).catch((error) => {
        console.error(`Failed to fetch room: ${buildingName} ${roomNumber}`);
        console.error(error);
      });
  };
}
