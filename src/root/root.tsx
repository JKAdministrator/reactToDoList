import React, { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { App } from "../app";

import AppContextProvider from "../appContext";

export const RootComponent = () => {
  //la salida debe especificar el valor inicial del proveedor (objeto vacio)
  return (
    <AppContextProvider>
      <App></App>
    </AppContextProvider>
  );
};
