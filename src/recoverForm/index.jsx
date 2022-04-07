import React, { useEffect, useState } from "react";
import style from "./style.module.scss";
import { useAppContext } from "../context/appContext";
import FatalErrorComponent from "../fatalErrorComponent";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

const RecoverForm = (props) => {
  //variables de estado
  const { getLanguageString, recoverUser, userDocId } = useAppContext();

  const [stateData, setStateData] = useState({
    email: props.email || "",
    state: "READY",
    stateErrorMessage: "",
    isEmailMissing: false,
    loginResponseMessage: "",
  });

  //ejecucion inicial
  useEffect(() => {
    switch (stateData.state) {
      case "AWAIT_RECOVER_RESPONSE": {
        async function recoverUserCallbak() {
          try {
            await recoverUser({
              email: stateData.email,
            });
          } catch (e) {
            throw e.toString();
          }
        }

        try {
          recoverUserCallbak();
          setStateData((_prevData) => {
            return {
              ..._prevData,
              state: "RECOVER_READY",
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

  useEffect(() => {}, [userDocId]);

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
    let loginResponseMessage = "";

    if (isEmailMissing || loginResponseMessage !== "") {
      setStateData({
        ...stateData,
        isEmailMissing,
        loginResponseMessage,
        state: "READY",
      });
      return;
    } else {
      setStateData({
        ...stateData,
        isEmailMissing,
        loginResponseMessage,
        state: "AWAIT_RECOVER_RESPONSE",
      });
      return;
    }
  };

  const getString = (string) => {
    return getLanguageString("recoverForm", string);
  };

  //html retornado
  return (
    <>
      <img
        src="./logos/recoverLogo.png"
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
              required
              autoFocus
              style={{ width: "100%" }}
              error={stateData.isEmailMissing}
              label={getString("email")}
            />
            <span name="loginResponse">{stateData.loginResponseMessage}</span>
            <Button
              variant="contained"
              onClick={handleSubmit}
              name="signupButton"
              style={{ width: "100%" }}
              disableElevation
            >
              {getString("recoverButton")}
            </Button>
            <Box
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
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
      stateData.state === "AWAIT_RECOVER_RESPONSE" ? (
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

      {stateData.state === "RECOVER_READY" ? (
        <Paper className={style.successMessageContainer}>
          <span>{getString("success")}</span>
          <Link to="/" name="login">
            <Button
              variant="contained"
              style={{ width: "100%" }}
              disableElevation
            >
              {getString("return")}
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
