import React, { useEffect } from "react";
import { Navigate, useRoutes, useNavigate } from "react-router-dom";
// layouts
import DashboardLayout from "../layouts/dashboard";
import LogoOnlyLayout from "../layouts/LogoOnlyLayout";
//

import Login from "../pages/Login";
import Register from "../pages/Register";

import NotFound from "../pages/Page404";
import DashboardApp from "../pages/DashboardApp";

import ForgotPassword from "src/pages/ForgotPassword";
import ResetPassword from "src/pages/ResetPassword";

//protected
import LoggedInProtection from "./LoggedInProtection";
import LoggedOutProtection from "./LoggedOutProtection";
import { getToken, deleteToken } from "src/store/localStorage";
import { loadProfile } from "src/store/actions/authActions";
import { useSelector, useDispatch } from "react-redux";
import ViewUsers from "src/pages/ViewUsers";
import Payments from "src/pages/Payments";
import Posts from "src/pages/Posts";

// ----------------------------------------------------------------------

export default function Router() {
  const { isSignedIn = false } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = getToken();
      if (token && !isSignedIn) {
        const loadProfileResponse = await dispatch(loadProfile(token));
        if (loadProfileResponse) {
          deleteToken();
          navigate("/");
        }
      }
    };
    fetchProfile();
    // if (!isSignedIn) {
    //   navigate("/login");
    // }
  }, [isSignedIn, dispatch, navigate]);

  return useRoutes([
    {
      path: "/",
      element: <LogoOnlyLayout />,
      children: [
        { path: "/", element: <Navigate to="/login" /> },
        {
          path: "login",
          element: (
            <LoggedOutProtection redirectTo={"/dashboard"}>
              <Login />
            </LoggedOutProtection>
          ),
        },

        {
          path: "forgot-password",
          element: (
            <LoggedOutProtection redirectTo={"/dashboard"}>
              <ForgotPassword />
            </LoggedOutProtection>
          ),
        },
        {
          path: "reset-password",
          element: <ResetPassword />,
        },

        { path: "404", element: <NotFound /> },
        { path: "*", element: <Navigate to="/404" /> },
      ],
    },
    {
      path: "/dashboard",
      element: (
        <LoggedInProtection redirectTo={"/"}>
          <DashboardLayout />
        </LoggedInProtection>
      ),
      children: [
        {
          path: "",
          element: (
            <LoggedInProtection redirectTo={"/"}>
              <DashboardApp />
            </LoggedInProtection>
          ),
        },
        {
          path: "users",
          element: (
            <LoggedInProtection redirectTo={"/"}>
              <ViewUsers />
            </LoggedInProtection>
          ),
        },
        {
          path: "payments",
          element: (
            <LoggedInProtection redirectTo={"/"}>
              <Payments />
            </LoggedInProtection>
          ),
        },
        {
          path: "posts",
          element: (
            <LoggedInProtection redirectTo={"/"}>
              <Posts />
            </LoggedInProtection>
          ),
        },
      ],
    },

    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}
