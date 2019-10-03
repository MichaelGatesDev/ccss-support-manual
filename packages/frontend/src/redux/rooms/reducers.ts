import {
  RoomsState, FETCH_ROOMS, RoomsActionTypes, FETCH_ROOM,
} from "./types";

const initialState: RoomsState = {
  roomsLoading: true,
  room: undefined,
  rooms: [],
};

export function roomsReducer(state = initialState, action: RoomsActionTypes): RoomsState {
  switch (action.type) {
    case FETCH_ROOMS:
      return {
        ...state,
        roomsLoading: false,
        rooms: action.payload,
      };
    case FETCH_ROOM:
      return {
        ...state,
        roomsLoading: false,
        room: action.payload,
      };
    default:
      return state;
  }
}
