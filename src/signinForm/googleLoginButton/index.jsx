import React, { useEffect, useState } from "react";
import style from "./style.module.scss";
import { useAppContext } from "../../context/appContext";
import { Button } from "@mui/material";
const GoogleLoginButton = () => {
  const { tryLogin } = useAppContext();

  function handleLoginClick(e) {
    tryLogin({ source: "google" });
  }

  return (
    <>
      <Button
        variant="outlined"
        title="Login with Google"
        onClick={handleLoginClick}
        style={{ pointerEvents: "all" }}
      >
        <img
          src="./logos/google.png"
          alt="Google login"
          title="Login with google"
        ></img>
      </Button>
    </>
  );
};

export default GoogleLoginButton;
