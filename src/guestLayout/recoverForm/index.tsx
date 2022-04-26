import React, { useEffect, useState, useCallback } from "react";
import style from "./style.module.scss";
import FatalErrorComponent from "../../common/fatalErrorComponent";
import { validateEmail } from "../../utils";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { Auth, getAuth, sendPasswordResetEmail } from "firebase/auth";
import { AppContext } from "../../appContext";
import { IAppContextData } from "../../appContext/index.d";

enum EnumComponentState {
  READY,
  AWAIT_RECOVER_RESPONSE,
  RECOVER_READY,
  INITIAL_LOADING,
  ERROR,
}

interface IStateObject {
  email: string;
  state: EnumComponentState;
  stateErrorMessage: string;
  isEmailMissing: boolean;
  loginResponseMessage: string;
}

interface IProps {
  email: string;
}

const RecoverForm: React.FC<IProps> = ({ email }: IProps) => {
  //variables de estado
  const { t } = useTranslation();
  const { themeObject } = React.useContext(AppContext) as IAppContextData;
  const [stateData, setStateData] = useState<IStateObject>({
    email: email || "",
    state: EnumComponentState.READY,
    stateErrorMessage: "",
    isEmailMissing: false,
    loginResponseMessage: "",
  });

  //ejecucion inicial
  useEffect(() => {
    switch (stateData.state) {
      case EnumComponentState.AWAIT_RECOVER_RESPONSE: {
        try {
          let recoverUserCallback = async (email: string) => {
            try {
              let auth: Auth = getAuth();
              await sendPasswordResetEmail(auth, email);
              return true;
            } catch (e) {
              throw e;
            }
          };
          recoverUserCallback(stateData.email)
            .then(() => {
              setStateData((_prevData: IStateObject) => {
                return {
                  ..._prevData,
                  state: EnumComponentState.RECOVER_READY,
                  loginResponseMessage: "",
                };
              });
            })
            .catch((e) => {
              setStateData((_prevData: IStateObject) => {
                return {
                  ..._prevData,
                  state: EnumComponentState.READY,
                  loginResponseMessage:
                    e.code === "auth/user-not-found"
                      ? "User not found"
                      : e.toString(),
                };
              });
            });
        } catch (e) {
          setStateData((_prevData: IStateObject) => {
            return {
              ..._prevData,
              state: EnumComponentState.READY,
              loginResponseMessage: e.toString(),
            };
          });
        }
        break;
      }
      case EnumComponentState.INITIAL_LOADING: {
        setStateData((_prevData: IStateObject) => {
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
    let value: String = "";
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
    let loginResponseMessage: string = "";

    if (!validateEmail(stateData.email)) {
      loginResponseMessage = "Invalid Email";
      isEmailMissing = true;
    }
    if (isEmailMissing || loginResponseMessage !== "") {
      setStateData({
        ...stateData,
        isEmailMissing,
        loginResponseMessage,
        state: EnumComponentState.READY,
      });
      return;
    } else {
      setStateData({
        ...stateData,
        isEmailMissing,
        loginResponseMessage,
        state: EnumComponentState.AWAIT_RECOVER_RESPONSE,
      });
      return;
    }
  };

  //html retornado
  return (
    <>
      <img
        src="./logos/recoverLogo.png"
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
              {t("recover-title")}
            </Typography>
            <TextField
              type="email"
              name="email"
              id="email"
              variant="outlined"
              value={stateData.email}
              onChange={changeHandler}
              required
              autoFocus
              style={{ width: "100%" }}
              error={stateData.isEmailMissing}
              label={t("recover-email")}
            />
            <span className="loginResponse">
              {stateData.loginResponseMessage}
            </span>
            <Button
              variant="contained"
              name="signupButton"
              style={{ width: "100%" }}
              disableElevation
              type="submit"
            >
              {t("recover-recoverButton")}
            </Button>
            <Box
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Link
                to="/signin"
                style={
                  themeObject.palette.mode === "dark"
                    ? { color: "#ffffffbf" }
                    : {}
                }
              >
                {t("recover-return")}
              </Link>
            </Box>
          </form>
        </Paper>
      ) : (
        <></>
      )}

      {stateData.state === EnumComponentState.INITIAL_LOADING ||
      stateData.state === EnumComponentState.AWAIT_RECOVER_RESPONSE ? (
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

      {stateData.state === EnumComponentState.RECOVER_READY ? (
        <Paper className={style.successMessageContainer}>
          <span>{t("recover-success")}</span>
          <Link to="/">
            <Button
              variant="contained"
              disableElevation
              style={
                themeObject.palette.mode === "dark"
                  ? { color: "#ffffffbf", width: "100%" }
                  : { width: "100%" }
              }
            >
              {t("recover-return")}
            </Button>
          </Link>
        </Paper>
      ) : (
        <></>
      )}
    </>
  );
};
export default RecoverForm;
