import { Building } from "@ccss-support-manual/common";
export interface BuildingsState {
    buildings: Building[];
    building: Building | null;
    buildingsLoading: boolean;
}
export declare const FETCH_BUILDINGS = "FETCH_BUILDINGS";
export declare const FETCH_BUILDING = "FETCH_BUILDING";
interface FetchBuildingsAction {
    type: typeof FETCH_BUILDINGS;
    payload: Building[];
}
interface FetchBuildingAction {
    type: typeof FETCH_BUILDING;
    payload: Building;
}
export declare type BuildingsActionTypes = FetchBuildingsAction | FetchBuildingAction;
export {};
