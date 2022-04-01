import style from "./style.module.scss";
import React, { useEffect, useState, useRef } from "react";
import SigninForm from "../signinForm/index.jsx";
import { AppProvider, useAppContext } from "../context/appContext";
import SectionManager from "../sections/manager";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignupForm from "../signupForm";
import RecoverForm from "../recoverForm";
import { Box, CircularProgress, Container, createTheme } from "@mui/material";
import { ThemeProvider } from "@emotion/react";

// el React context es un objeto
// tiene 2 partes "provider" y "consumer"
export const AppContext = React.createContext();

//envolvemos la app dentro del proveedor
//de esa forma cuando se crea la app lo hace dandole el proveedor a todos sus hijos
function providerFunction() {
  return (
    <AppProvider>
      <App></App>
    </AppProvider>
  );
}

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
                  <Box
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "flex-start",
                      width: "100%",
                      height: "100%",
                    }}
                  >
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
              <Box
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  width: "100%",
                  height: "100%",
                }}
              >
                <SignupForm></SignupForm>
              </Box>
            }
          />
          <Route
            path="recover"
            element={
              <Box
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  width: "100%",
                  height: "100%",
                }}
              >
                <RecoverForm />
              </Box>
            }
          />
          <Route
            path="*"
            element={
              <>
                <CircularProgress />
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}
export default providerFunction;
