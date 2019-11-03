import { Dispatch } from "redux";
import { TroubleshootingData } from "@ccss-support-manual/models";

import { FETCH_TROUBLESHOOTING_DATA, FETCH_TROUBLESHOOTING_DATA_FOR_ROOM } from "./types";

export function fetchTroubleshootingData() {
  return (dispatch: Dispatch) => {
    fetch("/api/v1/troubleshooting-data")
      .then((response) => response.json())
      .then((data: TroubleshootingData[]) => {
        dispatch({
          type: FETCH_TROUBLESHOOTING_DATA,
          payload: data,
        });
      }).catch((error) => {
        console.error("Failed to fetch troubleshooting data");
        console.error(error);
      });
  };
}

export function fetchTroubleshootingDataForRoom(buildingName: string, roomNumber: string | number) {
  return (dispatch: Dispatch) => {
    fetch(`/api/v1/troubleshooting-data/buildings/${buildingName}/rooms/${roomNumber}`)
      .then((response) => response.json())
      .then((data: TroubleshootingData[]) => {
        dispatch({
          type: FETCH_TROUBLESHOOTING_DATA_FOR_ROOM,
          payload: data,
        });
      }).catch((error) => {
        console.error(`Failed to fetch troubleshooting data for room: ${buildingName} ${roomNumber}`);
        console.error(error);
      });
  };
}
