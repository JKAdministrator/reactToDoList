import style from "./style.module.scss";
import React from "react";
import LoginForm from "../loginForm/index.jsx";
import { AppProvider, useAppContext } from "../context/appContext";
import LoaderAnimation from "../loaderAnimation";
import SectionManager from "../sections/manager";
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
  const {
    firebaseCurrentUser,
    firebaseConnectionState,
    firebaseConnectionStateError,
  } = useAppContext();

  //la salida debe especificar el valor inicial del proveedor (objeto vacio)
  return (
    <AppContext.Provider value={{}}>
      {firebaseConnectionState === "READY" && firebaseCurrentUser.uid ? (
        <SectionManager></SectionManager>
      ) : (
        <></>
      )}
      {firebaseConnectionState === "READY" && !firebaseCurrentUser.uid ? (
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
export default providerFunction;
