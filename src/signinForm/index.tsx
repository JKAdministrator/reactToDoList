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
import { validateEmail } from "../utils";

interface IProps {
  email: string;
  password: string;
}

enum EnumComponentState {
  READY,
  AWAIT_LOGIN_RESPONSE,
  INITIAL_LOADING,
  ERROR,
}

interface IStateObject {
  email: string;
  password: string;
  state: EnumComponentState;
  stateErrorMessage: string;
  isEmailMissing: boolean;
  isPasswordMissing: boolean;
  loginResponseMessage: string;
}

const SigninForm: React.FC<IProps> = (props: IProps) => {
  //variables de estado
  const { getLanguageString, loginUser, userDarkMode } = useAppContext();

  const [stateData, setStateData] = useState<IStateObject>({
    email: props.email || "",
    password: props.password || "",
    state: EnumComponentState.READY,
    stateErrorMessage: "",
    isEmailMissing: false,
    isPasswordMissing: false,
    loginResponseMessage: "",
  });

  //ejecucion inicial
  useEffect(() => {
    switch (stateData.state) {
      case EnumComponentState.AWAIT_LOGIN_RESPONSE: {
        let callLoginUser = async () => {
          try {
            await loginUser({
              source: "usernameAndPassword",
              email: stateData.email,
              password: stateData.password,
            });
          } catch (e) {
            setStateData((_prevData) => {
              return {
                ..._prevData,
                state: EnumComponentState.READY,
                loginResponseMessage: e.toString(),
              };
            });
          }
        };
        callLoginUser();
        break;
      }
      case EnumComponentState.INITIAL_LOADING: {
        setStateData((_prevData) => {
          return {
            ..._prevData,
            state: EnumComponentState.READY,
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
  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value: string = "";
    switch (e.target.name) {
      default: {
        value = e.target.value;
        break;
      }
    }
    setStateData({
      ...stateData,
      [e.target.name]: value,
    });
  };

  //verifica si se puede o no hacer el submit de los datos
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let isEmailMissing: boolean = stateData.email.length <= 0 ? true : false;
    let isPasswordMissing: boolean =
      stateData.password.length <= 0 ? true : false;

    if (!validateEmail(stateData.email)) isEmailMissing = true;
    if (isEmailMissing || isPasswordMissing) {
      setStateData({ ...stateData, isPasswordMissing, isEmailMissing });
      return;
    } else {
      setStateData({
        ...stateData,
        isPasswordMissing,
        isEmailMissing,
        state: EnumComponentState.AWAIT_LOGIN_RESPONSE,
      });
      return;
    }
  };

  const getString = (string: string) => {
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
      {stateData.state === EnumComponentState.READY ? (
        <Paper
          style={{
            marginTop: "3rem",
            width: "max-content",
            display: "flex",
            flexFlow: "column",
            alignItems: "center",
            zIndex: "1",
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
            <span>{stateData.loginResponseMessage}</span>
            <Button
              variant="contained"
              style={{ width: "100%" }}
              disableElevation
              type="submit"
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
              <Link
                to="/recover"
                style={userDarkMode ? { color: "#ffffffbf" } : {}}
              >
                {getString("forgot")}
              </Link>
              <Link
                to="/signup"
                style={userDarkMode ? { color: "#ffffffbf" } : {}}
              >
                {getString("signup")}
              </Link>
            </Box>

            <div>
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

      {stateData.state === EnumComponentState.INITIAL_LOADING ||
      stateData.state === EnumComponentState.AWAIT_LOGIN_RESPONSE ? (
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
      {stateData.state === EnumComponentState.ERROR ? (
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
