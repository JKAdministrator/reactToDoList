import "./App.scss";
import React, { useEffect, useState } from "react";
import LoginForm from "./loginForm";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDrujrTxfK2k8YgMgkB4qfLa2d5vY8361U",
  authDomain: "reactapptesting-4bfbb.firebaseapp.com",
  projectId: "reactapptesting-4bfbb",
  storageBucket: "reactapptesting-4bfbb.appspot.com",
  messagingSenderId: "269724904392",
  appId: "1:269724904392:web:093f1388cb2a90e2772efd",
  measurementId: "G-6MWE2KNEEG",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

function App() {
  const [theme, setTheme] = useState("ligth");
  console.log("theme", theme);
  console.log("app", app);
  console.log("analytics", analytics);
  useEffect(() => {
    document.body.classList.remove("dark");
    document.body.classList.remove("light");
    document.body.classList.add(theme);
  }, [theme]);
  return (
    <>
      <LoginForm name="loginForm"></LoginForm>
    </>
  );
}

export default App;
