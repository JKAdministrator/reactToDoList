import React, { useEffect } from "react";
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
