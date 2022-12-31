import {
  SIGN_IN_SUCCESS,
  SIGN_OUT_SUCCESS,
  LOAD_PROFILE_SUCCESS,
} from "../action-types";

const INITIAL_STATE = {
  isSignedIn: false,
  userID: "",
  firstName: "",
  lastName:"",
  role: "",
  gender:"",
  email:""
};

const authReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SIGN_IN_SUCCESS:

      return {
        ...state,
        isSignedIn: true,
        firstName: action.payload.firstName,
        lastName:action.payload.lastName,
        userID: action.payload._id,
        gender: action.payload.gender,
        email: action.payload.email,
        role:action.payload.role
      };
    case LOAD_PROFILE_SUCCESS:
      return {
        ...state,
        isSignedIn: true,
        firstName: action.payload.firstName,
        lastName:action.payload.lastName,
        userID: action.payload._id,
        gender: action.payload.gender,
        email: action.payload.email,
        role:action.payload.role
      };
    case SIGN_OUT_SUCCESS:
      return {
        ...state,
        isSignedIn: false,
        firstName: "",
        lastName:"",
        userID: "",
        gender: "",
        email: "",
        role:""
      };
    default:
      return { ...state };
  }
};

export default authReducer;
