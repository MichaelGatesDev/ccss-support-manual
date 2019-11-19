import { Room } from "@ccss-support-manual/models";

export interface RoomsState {
  data?: any,
  error?: string;

  fetchingRoom: boolean;
  fetchedRoom?: Room;

  fetchingRooms: boolean;
  fetchedRooms?: Room[];
}

// FETCH SINGLE ROOM
export const REQUEST_FETCH_ROOM = "REQUEST_FETCH_ROOM";
interface RequestFetchRoomAction {
  type: typeof REQUEST_FETCH_ROOM;
}
export const REQUEST_FETCH_ROOM_SUCCESS = "REQUEST_FETCH_ROOM_SUCCESS";
interface RequestFetchRoomSuccessAction {
  type: typeof REQUEST_FETCH_ROOM_SUCCESS;
  data: Room;
}
export const REQUEST_FETCH_ROOM_FAILURE = "REQUEST_FETCH_ROOM_FAILURE";
interface RequestFetchRoomFailureAction {
  type: typeof REQUEST_FETCH_ROOM_FAILURE;
  error: string;
}

// FETCH ALL ROOMS
export const REQUEST_FETCH_ROOMS = "REQUEST_FETCH_ROOMS";
interface RequestFetchRoomsAction {
  type: typeof REQUEST_FETCH_ROOMS;
}
export const REQUEST_FETCH_ROOMS_SUCCESS = "REQUEST_FETCH_ROOMS_SUCCESS";
interface RequestFetchRoomsSuccessAction {
  type: typeof REQUEST_FETCH_ROOMS_SUCCESS;
  data: Room[];
}
export const REQUEST_FETCH_ROOMS_FAILURE = "REQUEST_FETCH_ROOMS_FAILURE";
interface RequestFetchRoomsFailureAction {
  type: typeof REQUEST_FETCH_ROOMS_FAILURE;
  error: string;
}


export type RoomsActionTypes = (
  RequestFetchRoomAction | RequestFetchRoomSuccessAction | RequestFetchRoomFailureAction
  | RequestFetchRoomsAction | RequestFetchRoomsSuccessAction | RequestFetchRoomsFailureAction
);
