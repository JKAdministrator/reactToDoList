import React from "react";
import style from "./style.module.scss";
import { useAppContext } from "../../context/appContext";
import { Button } from "@mui/material";

const GoogleLoginButton: React.FC = () => {
  const { loginUser } = useAppContext();

  const handleLoginClick = (e: React.MouseEvent<HTMLElement>) => {
    loginUser({ source: "google" });
  };

  return (
    <>
      <Button
        variant="outlined"
        title="Login with Google"
        onClick={handleLoginClick}
        className={style.btn}
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
