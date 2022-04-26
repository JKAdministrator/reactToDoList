import { Box, CircularProgress, Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
import style from "./style.module.scss";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
  useLocation,
  Location,
} from "react-router-dom";
import NotFound from "../notFound";
import { AppContext } from "../appContext";
import { IAppContextData } from "../appContext/index.d";

const SignupForm: React.LazyExoticComponent<React.FC> = React.lazy(() => {
  return import("./signupForm");
});
const SigninForm: React.LazyExoticComponent<React.FC> = React.lazy(() => {
  return import("./signinForm");
});
const RecoverForm: React.LazyExoticComponent<React.FC> = React.lazy(() => {
  return import("./recoverForm");
});
const RedirectToGuestLayout: React.LazyExoticComponent<React.FC> = React.lazy(
  () => {
    return import("./redirectToGuestLayout");
  }
);
const GuestLayout: React.FC = () => {
  const { themeObject } = React.useContext(AppContext) as IAppContextData;
  return (
    <React.Suspense
      fallback={
        <CircularProgress
          style={{ position: "absolute", top: "calc(50% - 20px)" }}
        />
      }
    >
      <Routes>
        <Route path="/signup" element={<SignupForm />}></Route>
        <Route path="/recover" element={<RecoverForm />}></Route>
        <Route path="/signin" element={<SigninForm />}></Route>
        <Route path="/login" element={<SigninForm />}></Route>
        <Route path="/projects" element={<RedirectToGuestLayout />}></Route>
        <Route path="/projects/*" element={<RedirectToGuestLayout />}></Route>
        <Route path="/" element={<RedirectToGuestLayout />}></Route>
        <Route path="/*" element={<NotFound />}></Route>
      </Routes>
    </React.Suspense>
  );
};
export default GuestLayout;
