import React, { useEffect, useState } from "react";
import style from "./style.module.scss";
import FatalErrorComponent from "../../common/fatalErrorComponent";
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
import { validateEmail } from "../../utils";
import { useTranslation } from "react-i18next";
import { IAppContextData } from "../../appContext/index.d";
import { AppContext } from "../../appContext";
import {
  getAuth,
  signInWithEmailAndPassword,
  UserCredential,
} from "firebase/auth";

interface IProps {
  email: string;
  password: string;
}

enum EnumComponentState {
  READY,
  AWAIT_LOGIN_RESPONSE_FROM_GOOGLE,
  AWAIT_LOGIN_RESPONSE_FROM_SERVER,
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
  userCredential: UserCredential | null;
}

const loginUserToGoogle = async (email: string, password: string) => {
  try {
    let auth = getAuth();
    let user: UserCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return user;
  } catch (e) {
    throw e;
  }
};

const SigninForm: React.FC<IProps> = (props: IProps) => {
  const { t } = useTranslation();
  const { themeObject } = React.useContext(AppContext) as IAppContextData;
  const [stateData, setStateData] = useState<IStateObject>({
    email: props.email || "",
    password: props.password || "",
    state: EnumComponentState.READY,
    stateErrorMessage: "",
    isEmailMissing: false,
    isPasswordMissing: false,
    loginResponseMessage: "",
    userCredential: null,
  });

  //ejecucion inicial
  useEffect(() => {
    switch (stateData.state) {
      case EnumComponentState.AWAIT_LOGIN_RESPONSE_FROM_GOOGLE: {
        loginUserToGoogle(stateData.email, stateData.password)
          .then((user: UserCredential) => {
            setStateData((_prevData) => {
              return {
                ..._prevData,
                state: EnumComponentState.AWAIT_LOGIN_RESPONSE_FROM_SERVER,
                userCredential: user,
                stateErrorMessage: "",
              };
            });
          })
          .catch((e) => {
            let errorMessage = e.toString();
            setStateData((_prevData) => {
              return {
                ..._prevData,
                state: EnumComponentState.READY,
                loginResponseMessage: errorMessage,
              };
            });
          });
        break;
      }
      case EnumComponentState.INITIAL_LOADING: {
        setStateData((_prevData) => {
          return {
            ..._prevData,
            state: EnumComponentState.READY,
            stateErrorMessage: "",
            loginResponseMessage: "",
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
        state: EnumComponentState.AWAIT_LOGIN_RESPONSE_FROM_GOOGLE,
      });
      return;
    }
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
              {t("signinForm-title")}
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
              label={t("signinForm-email")}
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
              label={t("signinForm-password")}
            />
            <span style={{ color: "red" }}>
              {stateData.loginResponseMessage}
            </span>
            <Button
              variant="contained"
              style={{ width: "100%" }}
              disableElevation
              type="submit"
            >
              {t("signinForm-login")}
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
                style={
                  themeObject.palette.mode === "dark"
                    ? { color: "#ffffffbf" }
                    : {}
                }
              >
                {t("signinForm-forgot")}
              </Link>
              <Link
                to="/signup"
                style={
                  themeObject.palette.mode === "dark"
                    ? { color: "#ffffffbf" }
                    : {}
                }
              >
                {t("signinForm-signup")}
              </Link>
            </Box>
            <div>
              <span className={style.line}></span>
              <span className={style.text}>{t("signinForm-or")}</span>
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
      stateData.state === EnumComponentState.AWAIT_LOGIN_RESPONSE_FROM_SERVER ||
      stateData.state ===
        EnumComponentState.AWAIT_LOGIN_RESPONSE_FROM_GOOGLE ? (
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
