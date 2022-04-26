import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { useParams } from "react-router-dom";
import "./index.scss";
import { RootComponent } from "./root/root";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");
const root = ReactDOM.createRoot(rootElement);
// <React.Strict> Not used since it re-renders all the components twice, so its calling useEffect(()=>{},[]) twice in each component and breaking the login logic
root.render(<RootComponent />);
