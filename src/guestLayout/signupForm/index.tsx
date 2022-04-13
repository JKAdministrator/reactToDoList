import React, { useEffect, useState, useCallback } from "react";
import style from "./style.module.scss";
import FatalErrorComponent from "../../common/fatalErrorComponent";
import { Link } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Input,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { validateEmail } from "../../utils";
import { useTranslation } from "react-i18next";
import { getFunctions, httpsCallable } from "firebase/functions";
import Firebase from "../../appContext/firebase";
import { Auth, getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import i18next from "i18next";
import { AppContext } from "../../appContext";
import { IAppContextData } from "../../appContext/index.d";

interface IProps {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  userImage: string;
}

enum EnumComponentState {
  READY,
  AWAIT_REGISTER_RESPONSE,
  SIGNUP_READY,
  INITIAL_LOADING,
  ERROR,
}

interface IStateObject {
  email: string;
  password: string;
  confirmPassword: string;
  state: EnumComponentState;
  stateErrorMessage: string;
  isEmailMissing: boolean;
  isPasswordMissing: boolean;
  isConfirmPasswordMissing: boolean;
  loginResponseMessage: string;
}

const SignupForm: React.FC<IProps> = (props: IProps) => {
  const { t } = useTranslation();
  const { themeObject } = React.useContext(AppContext) as IAppContextData;

  const [stateData, setStateData] = useState<IStateObject>({
    email: props.email || "",
    password: props.password || "",
    confirmPassword: props.confirmPassword || "",
    state: EnumComponentState.READY,
    stateErrorMessage: "",
    isEmailMissing: false,
    isPasswordMissing: false,
    isConfirmPasswordMissing: false,
    loginResponseMessage: "",
  });

  //ejecucion inicial
  useEffect(() => {
    switch (stateData.state) {
      case EnumComponentState.AWAIT_REGISTER_RESPONSE: {
        const callCreateUser = async () => {
          try {
            const functions = getFunctions(Firebase);
            const createUserFunction = httpsCallable(functions, "createUser");
            let auth: Auth = getAuth();
            await createUserWithEmailAndPassword(
              auth,
              stateData.email,
              stateData.password
            );
          } catch (e) {
            throw e;
          }
        };

        callCreateUser()
          .then(() => {
            setStateData((_prevData) => {
              return {
                ..._prevData,
                state: EnumComponentState.SIGNUP_READY,
                loginResponseMessage: "",
              };
            });
          })
          .catch((e) => {
            setStateData((_prevData) => {
              return {
                ..._prevData,
                state: EnumComponentState.READY,
                loginResponseMessage: e ? e.toString() : "Server error",
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
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let isEmailMissing = stateData.email.length <= 0 ? true : false;
    let isPasswordMissing = stateData.password.length <= 0 ? true : false;
    let isConfirmPasswordMissing =
      stateData.confirmPassword.length <= 0 ? true : false;
    let loginResponseMessage = "";
    if (!validateEmail(stateData.email)) {
      isEmailMissing = true;
      loginResponseMessage = "Invalid Email";
    }
    if (
      !isPasswordMissing &&
      !isConfirmPasswordMissing &&
      !isEmailMissing &&
      stateData.password !== stateData.confirmPassword
    ) {
      loginResponseMessage = t("signup-passwordMissmatch");
      isPasswordMissing = true;
      isConfirmPasswordMissing = true;
    } else {
      loginResponseMessage = "";
    }

    if (
      isEmailMissing ||
      isPasswordMissing ||
      isConfirmPasswordMissing ||
      loginResponseMessage !== ""
    ) {
      setStateData({
        ...stateData,
        isPasswordMissing,
        isEmailMissing,
        isConfirmPasswordMissing,
        loginResponseMessage,
        state: EnumComponentState.READY,
      });
      return;
    } else {
      setStateData({
        ...stateData,
        isPasswordMissing,
        isEmailMissing,
        isConfirmPasswordMissing,
        loginResponseMessage,
        state: EnumComponentState.AWAIT_REGISTER_RESPONSE,
      });
      return;
    }
  };

  //html retornado
  return (
    <>
      {stateData.state === EnumComponentState.READY ? (
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
              component="h2"
              style={{
                alignSelf: "baseline",
                fontFamily: "RobotoRegular",
              }}
            >
              {t("signup-title")}
            </Typography>
            <TextField
              type="email"
              name="email"
              id="email"
              autoFocus
              variant="outlined"
              value={stateData.email}
              onChange={changeHandler}
              required
              style={{ width: "100%" }}
              error={stateData.isEmailMissing}
              label={t("signup-email")}
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
              label={t("signup-password")}
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
              label={t("signup-confirmPassword")}
            />
            <span>{stateData.loginResponseMessage}</span>
            <Button
              variant="contained"
              style={{ width: "100%" }}
              disableElevation
              type="submit"
            >
              {t("signup-signupButton")}
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
              <Link
                to="/"
                style={
                  themeObject.palette.mode === "dark"
                    ? { color: "#ffffffbf" }
                    : {}
                }
              >
                {t("signup-return")}
              </Link>
            </Box>
          </form>
        </Paper>
      ) : (
        <></>
      )}
      {stateData.state === EnumComponentState.INITIAL_LOADING ||
      stateData.state === EnumComponentState.AWAIT_REGISTER_RESPONSE ? (
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
      {stateData.state === EnumComponentState.SIGNUP_READY ? (
        <>
          <Paper className={style.successMessageContainer}>
            <span>{t("signup-success")}</span>
            <Link to="/">
              <Button
                variant="contained"
                style={
                  themeObject.palette.mode === "dark"
                    ? { color: "#ffffffbf", width: "100%" }
                    : { width: "100%" }
                }
                disableElevation
              >
                {t("signup-login")}
              </Button>
            </Link>
          </Paper>
          <img
            src="./logos/signupLogo.png"
            alt="company logo"
            className={style.floatBackground}
          />
        </>
      ) : (
        <></>
      )}
    </>
  );
};
export default SignupForm;
