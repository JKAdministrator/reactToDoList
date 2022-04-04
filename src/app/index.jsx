import style from "./style.module.scss";
import React, { useEffect, useState } from "react";
import { AppProvider, useAppContext } from "../context/appContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { ThemeProvider } from "@emotion/react";

//import SigninForm from "../signinForm/index.jsx";
//import SectionManager from "../sections/manager";
//import SignupForm from "../signupForm";
//import RecoverForm from "../recoverForm";

// el React context es un objeto
// tiene 2 partes "provider" y "consumer"
export const AppContext = React.createContext();

// <React.Suspense fallback={<CircularProgress />}></React.Suspense>;
//envolvemos la app dentro del proveedor
//de esa forma cuando se crea la app lo hace dandole el proveedor a todos sus hijos
function providerFunction() {
  return (
    <AppProvider>
      <App></App>
    </AppProvider>
  );
}

const RecoverForm = React.lazy(() => {
  return import("../recoverForm");
});

const SigninForm = React.lazy(() => {
  return import("../signinForm");
});

const SignupForm = React.lazy(() => {
  return import("../signupForm");
});

const SectionManager = React.lazy(() => {
  return import("../sections/manager");
});

function App() {
  const [state, setState] = useState("LOADING");
  const {
    firebaseConnectionState,
    firebaseConnectionStateError,
    userDocId,
    theme,
  } = useAppContext();

  useEffect(() => {
    if (firebaseConnectionState === "LOADING") setState("LOADING");
    else if (firebaseConnectionState === "ERROR") setState("ERROR");
    else if (userDocId !== "") setState("LOGUED_IN");
    else if (userDocId === "") setState("LOGUED_OUT");
  }, [userDocId, firebaseConnectionState]);

  console.log("state 2", state);
  //la salida debe especificar el valor inicial del proveedor (objeto vacio)
  return (
    <AppContext.Provider value={{}}>
      <React.Suspense fallback={<CircularProgress />}>
        <BrowserRouter>
          <Routes>
            <Route
              index
              path="/"
              element={
                <>
                  {state === "LOGUED_IN" ? (
                    <ThemeProvider theme={theme}>
                      <SectionManager></SectionManager>
                    </ThemeProvider>
                  ) : (
                    <></>
                  )}
                  {state === "LOGUED_OUT" ? (
                    <Box className={style.formContainer}>
                      <SigninForm name="signinForm"></SigninForm>
                    </Box>
                  ) : (
                    <></>
                  )}
                  {state === "LOADING" ? (
                    <div className={style.loader}>
                      <CircularProgress />
                    </div>
                  ) : (
                    <></>
                  )}
                  {state === "ERROR" ? (
                    <>
                      <span>error:</span>
                      <span>{firebaseConnectionStateError}</span>
                    </>
                  ) : (
                    <></>
                  )}
                </>
              }
            />
            <Route
              path="signUp"
              element={
                <Box className={style.formContainer}>
                  <SignupForm></SignupForm>
                </Box>
              }
            />
            <Route
              path="recover"
              element={
                <Box className={style.formContainer}>
                  <RecoverForm />
                </Box>
              }
            />
            <Route path="*" element={<CircularProgress />} />
          </Routes>
        </BrowserRouter>
      </React.Suspense>
    </AppContext.Provider>
  );
}
export default providerFunction;
