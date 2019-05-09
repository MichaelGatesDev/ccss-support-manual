import { FETCH_BUILDINGS, FETCH_BUILDING } from '../actions/types';

const initialState = {
    buildings: [],
    building: {},
    loading: true,
};

export default function (state = initialState, action: any) {
    switch (action.type) {
        default:
            return state;
        case FETCH_BUILDINGS:
            return {
                ...state,
                buildings: action.payload,
                loading: false,
            };
        case FETCH_BUILDING:
            return {
                ...state,
                building: action.payload,
                loading: false,
            };
    }
};