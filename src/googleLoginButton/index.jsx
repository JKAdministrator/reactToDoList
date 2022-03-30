import React, { useEffect, useState } from "react";
import style from "./style.module.scss";
import { useAppContext } from "../context/appContext";
const GoogleLoginButton = () => {
  const { tryLogin } = useAppContext();

  function handleLoginClick(e) {
    tryLogin({ source: "google" });
  }

  return (
    <>
      <button
        type="button"
        className={style.enable}
        title="Login with Google"
        onClick={handleLoginClick}
      >
        <img
          src="./logos/google.png"
          alt="Google login"
          title="Login with google"
        ></img>
      </button>
    </>
  );
};

export default GoogleLoginButton;
