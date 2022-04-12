/*import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./app";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
*/

// After
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./app";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
