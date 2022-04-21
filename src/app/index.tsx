import style from "./style.module.scss";
import React, { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useParams,
} from "react-router-dom";
import { Button, CircularProgress, Paper } from "@mui/material";
import { ThemeProvider } from "@emotion/react";
import { EnumUserLoginState, IAppContextData } from "../appContext/index.d";
import { AppContext } from "../appContext";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";
import { Auth, getAuth, signOut } from "firebase/auth";
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(LanguageDetector)
  .use(HttpApi)
  .init({
    supportedLngs: ["en", "es"],
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["cookie", "htmlTag", "localStorage", "path", "subdomain"],
      caches: ["cookie"],
    },
    backend: {
      loadPath: "/json/lan/{{lng}}/translation.json",
    },
    react: { useSuspense: false },
  });

const GuestLayout: React.LazyExoticComponent<React.FC> = React.lazy(() => {
  return import("../guestLayout");
});
const UserLayout: React.LazyExoticComponent<React.FC> = React.lazy(() => {
  return import("../userLayout");
});
const NotFound: React.LazyExoticComponent<React.FC> = React.lazy(() => {
  return import("../notFound");
});

export const App = () => {
  const { themeObject, userLoginState } = React.useContext(
    AppContext
  ) as IAppContextData;
  const params = useParams();

  console.log("app url param params", { params });

  const getLoader = () => {
    return (
      <div className={style.loader}>
        <CircularProgress
          style={{
            position: "absolute",
            top: "calc(50% - 20px)",
          }}
        />
      </div>
    );
  };

  const getError = () => {
    return (
      <>
        <span>error:</span>
        <span>Error connecting with Firebase database</span>
      </>
    );
  };

  const getLayout = () => {
    if (userLoginState === EnumUserLoginState.LOGUED_IN) return <UserLayout />;
    else if (userLoginState === EnumUserLoginState.LOGUED_OUT)
      return <GuestLayout />;
    else if (userLoginState === EnumUserLoginState.LOADING) return getLoader();
    else if (userLoginState === EnumUserLoginState.ERROR) return getError();
    else return <></>;
  };

  return (
    <ThemeProvider theme={themeObject}>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<>{getLayout()}</>}></Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};
