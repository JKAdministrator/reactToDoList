import React, { useEffect, useState } from "react";
import style from "./style.module.scss";
import { useAppContext } from "../context/appContext";
import FatalErrorComponent from "../fatalErrorComponent";
import GoogleLoginButton from "./googleLoginButton";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
const SigninForm = (props) => {
  //variables de estado
  const { getLanguageString, tryLogin } = useAppContext();

  const [stateData, setStateData] = useState({
    email: props.email || "",
    password: props.password || "",
    state: "READY",
    stateErrorMessage: "",
    isEmailMissing: false,
    isPasswordMissing: false,
    loginResponseMessage: "",
  });
  console.log("login form");

  //ejecucion inicial
  useEffect(async () => {
    switch (stateData.state) {
      case "AWAIT_LOGIN_RESPONSE": {
        try {
          await tryLogin({
            source: "usernameAndPassword",
            email: stateData.email,
            password: stateData.password,
          });
        } catch (e) {
          console.log("loginForm: AWAIT_LOGIN_RESPONSE ... error ", { e });
          setStateData((_prevData) => {
            return {
              ..._prevData,
              state: "READY",
              loginResponseMessage: e.toString(),
            };
          });
        }
        break;
      }
      case "INITIAL_LOADING": {
        setStateData((_prevData) => {
          return {
            ..._prevData,
            state: "READY",
            stateErrorMessage: "",
          };
        });
        break;
      }
      default:
        break;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateData.state]);

  // graba el nuevo estado del componente cuando se detecta un cambio en algun input
  const changeHandler = (e) => {
    let name = e.target.name;
    let value = "";
    switch (name) {
      default: {
        value = e.target.value;
        break;
      }
    }
    setStateData({
      ...stateData,
      [name]: value,
    });
  };

  //verifica si se puede o no hacer el submit de los datos
  const handleSubmit = (e) => {
    e.preventDefault();
    let isEmailMissing = stateData.email.toString().length <= 0 ? true : false;
    let isPasswordMissing =
      stateData.password.toString().length <= 0 ? true : false;
    if (isEmailMissing || isPasswordMissing) {
      setStateData({ ...stateData, isPasswordMissing, isEmailMissing });
      return;
    } else {
      setStateData({
        ...stateData,
        isPasswordMissing,
        isEmailMissing,
        state: "AWAIT_LOGIN_RESPONSE",
      });
      return;
    }
  };

  const getString = (string) => {
    return getLanguageString("signinForm", string);
  };

  //html retornado
  return (
    <>
      <img
        src="./logos/signinLogo.png"
        alt="company logo"
        className={style.floatBackground}
      />
      {stateData.state === "READY" ? (
        <Paper
          style={{
            marginTop: "3rem",
            width: "max-content",
            display: "flex",
            flexFlow: "column",
            alignItems: "center",
          }}
          className={style.container}
        >
          <form
            action="submit"
            id="LoginForm"
            onSubmit={handleSubmit}
            className={style.form}
          >
            <Typography
              variant="h3"
              component="h1"
              style={{
                alignSelf: "center",
                fontFamily: "LobsterRegular",
              }}
            >
              Tasky
            </Typography>
            <Typography
              variant="h5"
              component="h1"
              style={{
                alignSelf: "baseline",
                fontFamily: "RobotoRegular",
              }}
            >
              {getString("title")}
            </Typography>
            <TextField
              type="email"
              name="email"
              id="email"
              variant="outlined"
              value={stateData.email}
              onChange={changeHandler}
              autoFocus
              required
              style={{ width: "100%" }}
              error={stateData.isEmailMissing}
              label={getString("email")}
            />
            <TextField
              type="password"
              name="password"
              id="password"
              value={stateData.password}
              onChange={changeHandler}
              required
              error={stateData.isPasswordMissing}
              style={{ width: "100%" }}
              label={getString("password")}
            />
            <span name="loginResponse">{stateData.loginResponseMessage}</span>
            <Button
              variant="contained"
              onClick={handleSubmit}
              name="login"
              style={{ width: "100%" }}
              disableElevation
            >
              {getString("login")}
            </Button>
            <Box
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Link to="/recover" name="recover">
                {getString("forgot")}
              </Link>
              <Link to="/signup" name="signup">
                {getString("signup")}
              </Link>
            </Box>

            <div name="orSeparator">
              <span className={style.line}></span>
              <span className={style.text}>{getString("or")}</span>
              <span className={style.line}></span>
            </div>
            <Box
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <GoogleLoginButton></GoogleLoginButton>
            </Box>
          </form>
        </Paper>
      ) : (
        <></>
      )}

      {stateData.state === "INITIAL_LOADING" ||
      stateData.state === "AWAIT_LOGIN_RESPONSE" ? (
        <CircularProgress
          disableShrink
          variant="indeterminate"
          thickness={6}
          sx={{
            marginTop: "4rem",
            color: (theme) =>
              theme.palette.mode === "light" ? "#1a90ff" : "#308fe8",
            animationDuration: "800ms",
          }}
        />
      ) : (
        <></>
      )}
      {stateData.state === "ERROR" ? (
        <FatalErrorComponent
          mensaje={stateData.stateErrorMessage}
        ></FatalErrorComponent>
      ) : (
        <></>
      )}
    </>
  );
};
export default SigninForm;
