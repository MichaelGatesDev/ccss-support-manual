import { FETCH_IMAGES } from '../actions/types';

const initialState = {
    images: {
        buildingImages: [],
        roomImages: [],
    },
    loading: true,
};

export default function (state = initialState, action: any) {
    switch (action.type) {
        default:
            return state;
        case FETCH_IMAGES:
            return {
                ...state,
                images: action.payload,
                loading: false,
            };
    }
};