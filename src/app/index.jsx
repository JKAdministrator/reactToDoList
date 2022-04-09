import style from "./style.module.scss";
import React, { useEffect, useState } from "react";
import { AppProvider, useAppContext } from "../context/appContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CircularProgress, Paper } from "@mui/material";
import { ThemeProvider } from "@emotion/react";
import NotFound from "../notFound";

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

const ScreenManager = React.lazy(() => {
  return import("../screenManager");
});

function App() {
  const [state, setState] = useState("LOADING");
  const {
    firebaseConnectionState,
    firebaseConnectionStateError,
    userUid,
    themeObject,
    userDarkMode,
  } = useAppContext();

  useEffect(() => {
    if (firebaseConnectionState === "LOADING") setState("LOADING");
    else if (firebaseConnectionState === "ERROR") setState("ERROR");
    else if (userUid !== "") setState("LOGUED_IN");
    else if (userUid === "") setState("LOGUED_OUT");
  }, [userUid, firebaseConnectionState]);

  //la salida debe especificar el valor inicial del proveedor (objeto vacio)
  return (
    <AppContext.Provider value={{}}>
      <ThemeProvider theme={themeObject}>
        <React.Suspense
          fallback={
            <CircularProgress
              style={{ position: "absolute", top: "calc(50% - 20px)" }}
            />
          }
        >
          <BrowserRouter>
            <Routes>
              <Route
                index
                path="/"
                element={
                  <>
                    {state === "LOGUED_IN" ? (
                      <ScreenManager></ScreenManager>
                    ) : (
                      <></>
                    )}
                    {state === "LOGUED_OUT" ? (
                      <Paper
                        className={style.formContainer}
                        style={
                          userDarkMode ? { backgroundColor: "rgb(0 0 0)" } : {}
                        }
                      >
                        <SigninForm name="signinForm"></SigninForm>
                      </Paper>
                    ) : (
                      <></>
                    )}
                    {state === "LOADING" ? (
                      <div className={style.loader}>
                        <CircularProgress
                          style={{
                            position: "absolute",
                            top: "calc(50% - 20px)",
                          }}
                        />
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
                  <Paper
                    className={style.formContainer}
                    style={
                      userDarkMode ? { backgroundColor: "rgb(0 0 0)" } : {}
                    }
                  >
                    <SignupForm></SignupForm>
                  </Paper>
                }
              />
              <Route
                path="recover"
                element={
                  <Paper
                    className={style.formContainer}
                    style={
                      userDarkMode ? { backgroundColor: "rgb(0 0 0)" } : {}
                    }
                  >
                    <RecoverForm />
                  </Paper>
                }
              />
              <Route
                path="*"
                element={
                  <>
                    <NotFound></NotFound>
                  </>
                }
              />
              <Route component={NotFound} />
            </Routes>
          </BrowserRouter>
        </React.Suspense>
      </ThemeProvider>
    </AppContext.Provider>
  );
}
export default providerFunction;
