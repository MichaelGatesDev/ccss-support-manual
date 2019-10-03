import { Room } from "@ccss-support-manual/models";

export interface RoomsState {
  roomsLoading: boolean;

  room: Room | undefined;
  rooms: Room[];
}

// Describing the different ACTION NAMES available
export const FETCH_ROOMS = "FETCH_ROOMS";
export const FETCH_ROOM = "FETCH_ROOM";

interface FetchRoomsAction {
  type: typeof FETCH_ROOMS;
  payload: Room[];
}

interface FetchRoomAction {
  type: typeof FETCH_ROOM;
  payload: Room;
}

export type RoomsActionTypes = FetchRoomsAction | FetchRoomAction;
