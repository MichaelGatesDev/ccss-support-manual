import { TroubleshootingData } from "@ccss-support-manual/models";

export interface TroubleshootingState {
  loading: boolean;

  data: TroubleshootingData[];
}

// Describing the different ACTION NAMES available
export const FETCH_TROUBLESHOOTING_DATA = "FETCH_TROUBLESHOOTING_DATA";
export const FETCH_TROUBLESHOOTING_DATA_FOR_ROOM = "FETCH_TROUBLESHOOTING_DATA_FOR_ROOM";

interface FetchTroubleshootingDataAction {
  type: typeof FETCH_TROUBLESHOOTING_DATA;
  payload: TroubleshootingData[];
}

interface FetchTroubleshootingDataForRoomAction {
  type: typeof FETCH_TROUBLESHOOTING_DATA_FOR_ROOM;
  payload: TroubleshootingData[];
}

export type TroubleshootingDataActionTypes = FetchTroubleshootingDataAction | FetchTroubleshootingDataForRoomAction;
