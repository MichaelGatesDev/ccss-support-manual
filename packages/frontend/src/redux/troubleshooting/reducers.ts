import {
  FETCH_TROUBLESHOOTING_DATA, FETCH_TROUBLESHOOTING_DATA_FOR_ROOM, TroubleshootingState, TroubleshootingDataActionTypes,
} from "./types";

const initialState: TroubleshootingState = {
  loading: true,
  data: [],
};

export function troubleshootingReducer(state = initialState, action: TroubleshootingDataActionTypes): TroubleshootingState {
  switch (action.type) {
    case FETCH_TROUBLESHOOTING_DATA:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };
    case FETCH_TROUBLESHOOTING_DATA_FOR_ROOM:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };
    default:
      return state;
  }
}
