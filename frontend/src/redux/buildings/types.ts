import { Building } from 'backend/src/Building';

export interface BuildingsState {
    buildings: Building[];
    building: Building | null;
    buildingsLoading: boolean;
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
