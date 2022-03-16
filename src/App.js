import "./App.scss";
import React, { useEffect, useState } from "react";
import LoginForm from "./loginForm";
function App() {
  const [theme, setTheme] = useState("ligth");
  console.log("theme", theme);
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
