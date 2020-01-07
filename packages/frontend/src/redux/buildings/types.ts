import { Building } from "@ccss-support-manual/models";

export interface BuildingsState {
  data?: any;
  error?: string;

  fetchingBuilding: boolean;
  fetchedBuilding?: Building;

  fetchingBuildings: boolean;
  fetchedBuildings?: Building[];

  addingBuilding: boolean;
  removingBuilding: boolean;
  updatingBuilding: boolean;
}

// FETCH SINGLE BUILDING
export const REQUEST_FETCH_BUILDING = "REQUEST_FETCH_BUILDING";
interface RequestFetchBuildingAction {
  type: typeof REQUEST_FETCH_BUILDING;
}
export const REQUEST_FETCH_BUILDING_SUCCESS = "REQUEST_FETCH_BUILDING_SUCCESS";
interface RequestFetchBuildingSuccessAction {
  type: typeof REQUEST_FETCH_BUILDING_SUCCESS;
  data: Building;
}
export const REQUEST_FETCH_BUILDING_FAILURE = "REQUEST_FETCH_BUILDING_FAILURE";
interface RequestFetchBuildingFailureAction {
  type: typeof REQUEST_FETCH_BUILDING_FAILURE;
  error: string;
}

// FETCH ALL BUILDINGS
export const REQUEST_FETCH_BUILDINGS = "REQUEST_FETCH_BUILDINGS";
interface RequestFetchBuildingsAction {
  type: typeof REQUEST_FETCH_BUILDINGS;
}
export const REQUEST_FETCH_BUILDINGS_SUCCESS = "REQUEST_FETCH_BUILDINGS_SUCCESS";
interface RequestFetchBuildingsSuccessAction {
  type: typeof REQUEST_FETCH_BUILDINGS_SUCCESS;
  data: Building[];
}
export const REQUEST_FETCH_BUILDINGS_FAILURE = "REQUEST_FETCH_BUILDINGS_FAILURE";
interface RequestFetchBuildingsFailureAction {
  type: typeof REQUEST_FETCH_BUILDINGS_FAILURE;
  error: string;
}

// ADD BUILDING
export const REQUEST_ADD_BUILDING = "REQUEST_ADD_BUILDING";
interface RequestAddBuildingAction {
  type: typeof REQUEST_ADD_BUILDING;
}
export const REQUEST_ADD_BUILDING_SUCCESS = "REQUEST_ADD_BUILDING_SUCCESS";
interface RequestAddBuildingSuccessAction {
  type: typeof REQUEST_ADD_BUILDING_SUCCESS;
  data: any;
}
export const REQUEST_ADD_BUILDING_FAILURE = "REQUEST_ADD_BUILDING_FAILURE";
interface RequestAddBuildingFailureAction {
  type: typeof REQUEST_ADD_BUILDING_FAILURE;
  error: string;
}

// UPDATE BUILDING
export const REQUEST_UPDATE_BUILDING = "REQUEST_UPDATE_BUILDING";
interface RequestUPDATEBuildingAction {
  type: typeof REQUEST_UPDATE_BUILDING;
}
export const REQUEST_UPDATE_BUILDING_SUCCESS = "REQUEST_UPDATE_BUILDING_SUCCESS";
interface RequestUPDATEBuildingSuccessAction {
  type: typeof REQUEST_UPDATE_BUILDING_SUCCESS;
  data: any;
}
export const REQUEST_UPDATE_BUILDING_FAILURE = "REQUEST_UPDATE_BUILDING_FAILURE";
interface RequestUPDATEBuildingFailureAction {
  type: typeof REQUEST_UPDATE_BUILDING_FAILURE;
  error: string;
}

// REMOVE BUILDING
export const REQUEST_REMOVE_BUILDING = "REQUEST_REMOVE_BUILDING";
interface RequestRemoveBuildingAction {
  type: typeof REQUEST_REMOVE_BUILDING;
}
export const REQUEST_REMOVE_BUILDING_SUCCESS = "REQUEST_REMOVE_BUILDING_SUCCESS";
interface RequestRemoveBuildingSuccessAction {
  type: typeof REQUEST_REMOVE_BUILDING_SUCCESS;
  data: any;
}
export const REQUEST_REMOVE_BUILDING_FAILURE = "REQUEST_REMOVE_BUILDING_FAILURE";
interface RequestRemoveBuildingFailureAction {
  type: typeof REQUEST_REMOVE_BUILDING_FAILURE;
  error: string;
}


export type BuildingsActionTypes = (
  RequestFetchBuildingAction | RequestFetchBuildingSuccessAction | RequestFetchBuildingFailureAction
  | RequestFetchBuildingsAction | RequestFetchBuildingsSuccessAction | RequestFetchBuildingsFailureAction
  | RequestAddBuildingAction | RequestAddBuildingSuccessAction | RequestAddBuildingFailureAction
  | RequestUPDATEBuildingAction | RequestUPDATEBuildingSuccessAction | RequestUPDATEBuildingFailureAction
  | RequestRemoveBuildingAction | RequestRemoveBuildingSuccessAction | RequestRemoveBuildingFailureAction
);
