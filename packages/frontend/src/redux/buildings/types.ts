import { Building } from "@ccss-support-manual/models";

export interface BuildingsState {
  buildingsLoading: boolean;

  building: Building | undefined;
  buildings: Building[];
}

// Describing the different ACTION NAMES available
export const FETCH_BUILDINGS = "FETCH_BUILDINGS";
export const FETCH_BUILDING = "FETCH_BUILDING";

interface FetchBuildingsAction {
  type: typeof FETCH_BUILDINGS;
  payload: Building[];
}

interface FetchBuildingAction {
  type: typeof FETCH_BUILDING;
  payload: Building;
}

export type BuildingsActionTypes = FetchBuildingsAction | FetchBuildingAction;
