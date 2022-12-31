import { combineReducers } from "redux";

// reducer import
import authReducer from "./authReducer";

// ==============================|| COMBINE REDUCER ||============================== //

export default combineReducers({
  auth: authReducer,
});
