import style from "./style.module.scss";
import React, { useEffect, useState, useRef } from "react";
import SigninForm from "../signinForm/index.jsx";
import { AppProvider, useAppContext } from "../context/appContext";
import LoaderAnimation from "../loaderAnimation";
import SectionManager from "../sections/manager";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignupForm from "../signupForm";
import RecoverForm from "../recoverForm";

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
  const { firebaseConnectionState, firebaseConnectionStateError, userDocId } =
    useAppContext();

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
            element={
              <>
                {state === "LOGUED_IN" ? (
                  <SectionManager></SectionManager>
                ) : (
                  <></>
                )}
                {state === "LOGUED_OUT" ? (
                  <SigninForm name="signinForm"></SigninForm>
                ) : (
                  <></>
                )}
                {state === "LOADING" ? (
                  <div className={style.loader}>
                    <LoaderAnimation />
                    <span>sarasa</span>
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
            path="signIn"
            element={
              <>
                <LoaderAnimation />
                <span>signIn</span>
              </>
            }
          />
          <Route
            path="signUp"
            element={
              <>
                <SignupForm />
              </>
            }
          />
          <Route
            path="recover"
            element={
              <>
                <RecoverForm />
              </>
            }
          />
          <Route
            path="*"
            element={
              <>
                <LoaderAnimation /> <span>sarasa</span>
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}
export default providerFunction;
