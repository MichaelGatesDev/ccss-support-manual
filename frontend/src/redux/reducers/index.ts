import { combineReducers } from 'redux';

import buildingReducer from './buildingReducer';
import imagesReducer from './imagesReducer';


export default combineReducers({
    buildings: buildingReducer,
    images: imagesReducer,
});