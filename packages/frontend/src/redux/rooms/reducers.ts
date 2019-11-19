import {
  RoomsState,
  RoomsActionTypes,

  REQUEST_FETCH_ROOM, REQUEST_FETCH_ROOM_FAILURE, REQUEST_FETCH_ROOM_SUCCESS,
  REQUEST_FETCH_ROOMS, REQUEST_FETCH_ROOMS_SUCCESS, REQUEST_FETCH_ROOMS_FAILURE,
} from "./types";

const initialState: RoomsState = {
  fetchingRoom: false,
  fetchingRooms: false,
};

export function roomsReducer(state = initialState, action: RoomsActionTypes): RoomsState {
  switch (action.type) {
    // DEFAULT
    default: return state;
    // FETCH SINGLE ROOM
    case REQUEST_FETCH_ROOM:
      return {
        ...state,
        fetchingRoom: true,
      };
    case REQUEST_FETCH_ROOM_SUCCESS:
      return {
        ...state,
        fetchingRoom: false,
        fetchedRoom: action.data,
      };
    case REQUEST_FETCH_ROOM_FAILURE:
      return {
        ...state,
        fetchingRoom: false,
        error: action.error,
      };
    // FETCH ALL ROOMS
    case REQUEST_FETCH_ROOMS:
      return {
        ...state,
        fetchingRooms: true,
      };
    case REQUEST_FETCH_ROOMS_SUCCESS:
      return {
        ...state,
        fetchingRooms: false,
        fetchedRooms: action.data,
      };
    case REQUEST_FETCH_ROOMS_FAILURE:
      return {
        ...state,
        fetchingRooms: false,
        error: action.error,
      };
  }
}
