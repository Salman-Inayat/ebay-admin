import authInstance from "src/axios/authInstance";
import {
  SIGN_IN_SUCCESS,
  SIGN_OUT_SUCCESS,
  LOAD_PROFILE_SUCCESS,
} from "../action-types";
import { saveToken, deleteToken } from "../localStorage";

export const signIn = (formValues) => {
  const { email, password } = formValues;

  return async (dispatch) => {
    const loginResponse = await authInstance.post("/sign-in-as-admin", {
      email,
      password,
    });
    console.log(loginResponse);
    saveToken(loginResponse.data.token);
    dispatch({ type: SIGN_IN_SUCCESS, payload: loginResponse.data.user });
  };
};

export const signUp = (formValues) => {
  const {
    email,
    password,
    confirmPassword,
    firstName,
    lastName,
    phoneNo,
    role,
  } = formValues;

  return async (dispatch) => {
    const signUpResponse = await authInstance.post("/sign-up", {
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
      phoneNo,
      role,
    });
  };
};

export const loadProfile = (token) => {
  return async (dispatch) => {
    try {
      const loadProfileResponse = await authInstance.get("/", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      dispatch({
        type: LOAD_PROFILE_SUCCESS,
        payload: loadProfileResponse.data.user,
      });
    } catch (error) {
      return error;
    }
  };
};

export const signOut = () => {
  deleteToken();
  return { type: SIGN_OUT_SUCCESS };
};
