import React, { useEffect, useState } from "react";
import style from "./style.module.scss";
import { AppProvider, useAppContext } from "../context/appContext";
import FatalErrorComponent from "../fatalErrorComponent";
import { Outlet, Link } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { width } from "@mui/system";
const SignupForm = (props) => {
  //variables de estado
  const { getLanguageString, trySignup, userDocId } = useAppContext();

  const [stateData, setStateData] = useState({
    username: props.username || "",
    email: props.email || "",
    password: props.password || "",
    confirmPassword: props.confirmPassword || "",
    state: "READY",
    stateErrorMessage: "",
    isUsernameMissing: false,
    isEmailMissing: false,
    isPasswordMissing: false,
    isConfirmPasswordMissing: false,
    loginResponseMessage: "",
  });

  //ejecucion inicial
  useEffect(async () => {
    switch (stateData.state) {
      case "AWAIT_REGISTER_RESPONSE": {
        try {
          await trySignup({
            email: stateData.email,
            password: stateData.password,
            username: stateData.username,
          });

          setStateData((_prevData) => {
            return {
              ..._prevData,
              state: "LOGIN_READY",
              loginResponseMessage: "",
            };
          });
        } catch (e) {
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

  useEffect(async () => {}, [userDocId]);

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
    let isUsernameMissing =
      stateData.username.toString().length <= 0 ? true : false;
    let isEmailMissing = stateData.email.toString().length <= 0 ? true : false;
    let isPasswordMissing =
      stateData.password.toString().length <= 0 ? true : false;
    let isConfirmPasswordMissing =
      stateData.confirmPassword.toString().length <= 0 ? true : false;
    let loginResponseMessage = "";
    if (
      !isUsernameMissing &&
      !isPasswordMissing &&
      !isConfirmPasswordMissing &&
      !isEmailMissing &&
      stateData.password.toString() !== stateData.confirmPassword.toString()
    ) {
      loginResponseMessage = getString("passwordMissmatch");
      isPasswordMissing = true;
      isConfirmPasswordMissing = true;
    } else {
      loginResponseMessage = "";
    }

    if (
      isUsernameMissing ||
      isEmailMissing ||
      isPasswordMissing ||
      isConfirmPasswordMissing ||
      loginResponseMessage !== ""
    ) {
      setStateData({
        ...stateData,
        isPasswordMissing,
        isUsernameMissing,
        isEmailMissing,
        isConfirmPasswordMissing,
        loginResponseMessage,
        state: "READY",
      });
      return;
    } else {
      setStateData({
        ...stateData,
        isPasswordMissing,
        isUsernameMissing,
        isEmailMissing,
        isConfirmPasswordMissing,
        loginResponseMessage,
        state: "AWAIT_REGISTER_RESPONSE",
      });
      return;
    }
  };

  const getString = (string) => {
    return getLanguageString("signupForm", string);
  };

  //html retornado
  return (
    <>
      <img
        src="./logos/signupLogo.png"
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
            class={style.form}
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
              component="h2"
              style={{
                alignSelf: "baseline",
                fontFamily: "RobotoRegular",
              }}
            >
              {getString("title")}
            </Typography>
            <TextField
              type="username"
              name="username"
              id="username"
              variant="outlined"
              value={stateData.username}
              onChange={changeHandler}
              autoFocus
              required
              style={{ width: "100%" }}
              error={stateData.isUsernameMissing}
              label={getString("username")}
            />
            <TextField
              type="email"
              name="email"
              id="email"
              variant="outlined"
              value={stateData.email}
              onChange={changeHandler}
              required
              style={{ width: "100%" }}
              error={stateData.isEmailMissing}
              label={getString("email")}
            />
            <TextField
              type="password"
              name="password"
              id="password"
              variant="outlined"
              value={stateData.password}
              onChange={changeHandler}
              required
              style={{ width: "100%" }}
              error={stateData.isPasswordMissing}
              label={getString("password")}
            />
            <TextField
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              variant="outlined"
              value={stateData.confirmPassword}
              onChange={changeHandler}
              required
              style={{ width: "100%" }}
              error={stateData.isConfirmPasswordMissing}
              label={getString("confirmPassword")}
            />
            <span name="loginResponse">{stateData.loginResponseMessage}</span>
            <Button
              variant="contained"
              onClick={handleSubmit}
              name="signupButton"
              style={{ width: "100%" }}
              disableElevation
            >
              {getString("signupButton")}
            </Button>
            <Box
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexFlow: "column",
                justifyContent: "felx-start",
                alignItems: "flex-start",
              }}
            >
              <Link to="/" name="signup">
                {getString("return")}
              </Link>
            </Box>
          </form>
        </Paper>
      ) : (
        <></>
      )}
      {stateData.state === "INITIAL_LOADING" ||
      stateData.state === "AWAIT_REGISTER_RESPONSE" ? (
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
      {stateData.state === "LOGIN_READY" ? (
        <Paper className={style.successMessageContainer}>
          <span>{getString("success")}</span>
          <Link to="/" name="login">
            <Button
              variant="contained"
              style={{ width: "100%" }}
              disableElevation
            >
              {getString("login")}
            </Button>
          </Link>
        </Paper>
      ) : (
        <></>
      )}
    </>
  );
};
export default SignupForm;
