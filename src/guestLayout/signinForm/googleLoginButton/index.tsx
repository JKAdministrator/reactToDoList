import React from "react";
import style from "./style.module.scss";
import { Button } from "@mui/material";
import { getAuth, GoogleAuthProvider, signInWithRedirect } from "firebase/auth";

const GoogleLoginButton: React.FC = () => {
  const handleLoginClick = (e: React.MouseEvent<HTMLElement>) => {
    signInWithRedirect(getAuth(), new GoogleAuthProvider());
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
