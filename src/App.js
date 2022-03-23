import style from "./App.module.scss";
import React, { useEffect, useState } from "react";
import LoginForm from "./loginForm";
import { AppProvider, useAppContext } from "./context/appContext";
import LoaderAnimation from "./loaderAnimation";
import { getAuth, getRedirectResult, GoogleAuthProvider } from "firebase/auth";

// el React context es un objeto
// tiene 2 partes "provider" y "consumer"
export const AppContext = React.createContext();

//envolvemos la app dentro del proveedor
//de esa forma cuando se crea la app lo hace dandole el proveedor a todos sus hijos
export default () => (
  <AppProvider>
    <App></App>
  </AppProvider>
);

function App() {
  const { firebaseConnectionState, firebaseConnectionStateError } =
    useAppContext();
  //la salida debe especificar el valor inicial del proveedor (objeto vacio)
  return (
    <AppContext.Provider value={{}}>
      {firebaseConnectionState === "READY" ? (
        <LoginForm name="loginForm"></LoginForm>
      ) : (
        <></>
      )}
      {firebaseConnectionState === "LOADING" ? (
        <>
          <div className={style.loader}>
            <LoaderAnimation />
          </div>
        </>
      ) : (
        <></>
      )}
      {firebaseConnectionState === "ERROR" ? (
        <>
          <span>error:</span>
          <span>{firebaseConnectionStateError}</span>
        </>
      ) : (
        <></>
      )}
    </AppContext.Provider>
  );
}
