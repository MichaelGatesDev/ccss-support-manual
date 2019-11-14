import {
  BuildingsState,
  BuildingsActionTypes,

  REQUEST_FETCH_BUILDING, REQUEST_FETCH_BUILDING_FAILURE, REQUEST_FETCH_BUILDING_SUCCESS,
  REQUEST_FETCH_BUILDINGS, REQUEST_FETCH_BUILDINGS_SUCCESS, REQUEST_FETCH_BUILDINGS_FAILURE,
  REQUEST_ADD_BUILDING, REQUEST_ADD_BUILDING_FAILURE, REQUEST_ADD_BUILDING_SUCCESS,
  REQUEST_EDIT_BUILDING, REQUEST_EDIT_BUILDING_FAILURE, REQUEST_EDIT_BUILDING_SUCCESS,
  REQUEST_REMOVE_BUILDING, REQUEST_REMOVE_BUILDING_FAILURE, REQUEST_REMOVE_BUILDING_SUCCESS,

} from "./types";

const initialState: BuildingsState = {
  fetchingBuilding: false,

  fetchingBuildings: false,

  addingBuilding: false,

  removingBuilding: false,

  editingBuilding: false,
};

export function buildingsReducer(state = initialState, action: BuildingsActionTypes): BuildingsState {
  switch (action.type) {
    // DEFAULT
    default: return state;
    // FETCH SINGLE BUILDING
    case REQUEST_FETCH_BUILDING:
      return {
        ...state,
        fetchingBuilding: true,
      };
    case REQUEST_FETCH_BUILDING_SUCCESS:
      return {
        ...state,
        fetchingBuilding: false,
        fetchedBuilding: action.data,
      };
    case REQUEST_FETCH_BUILDING_FAILURE:
      return {
        ...state,
        fetchingBuilding: false,
        error: action.error,
      };
    // FETCH ALL BUILDINGS
    case REQUEST_FETCH_BUILDINGS:
      return {
        ...state,
        fetchingBuildings: true,
      };
    case REQUEST_FETCH_BUILDINGS_SUCCESS:
      return {
        ...state,
        fetchingBuildings: false,
        fetchedBuildings: action.data,
      };
    case REQUEST_FETCH_BUILDINGS_FAILURE:
      return {
        ...state,
        fetchingBuildings: false,
        error: action.error,
      };
    // ADD BUILDING
    case REQUEST_ADD_BUILDING:
      return {
        ...state,
        addingBuilding: true,
      };
    case REQUEST_ADD_BUILDING_SUCCESS:
      return {
        ...state,
        addingBuilding: false,
        data: action.data,
      };
    case REQUEST_ADD_BUILDING_FAILURE:
      return {
        ...state,
        addingBuilding: false,
        error: action.error,
      };
    // EDIT BUILDING
    case REQUEST_EDIT_BUILDING:
      return {
        ...state,
        editingBuilding: true,
      };
    case REQUEST_EDIT_BUILDING_SUCCESS:
      return {
        ...state,
        editingBuilding: false,
      };
    case REQUEST_EDIT_BUILDING_FAILURE:
      return {
        ...state,
        editingBuilding: false,
        error: action.error,
      };
    // REMOVE BUILDING
    case REQUEST_REMOVE_BUILDING:
      return {
        ...state,
        removingBuilding: true,
      };
    case REQUEST_REMOVE_BUILDING_SUCCESS:
      return {
        ...state,
        removingBuilding: false,
      };
    case REQUEST_REMOVE_BUILDING_FAILURE:
      return {
        ...state,
        removingBuilding: false,
        error: action.error,
      };
  }
}
