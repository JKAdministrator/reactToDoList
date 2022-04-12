import React, { useEffect, useState } from "react";
import style from "./style.module.scss";
import { useAppContext } from "../context/appContext";
import FatalErrorComponent from "../fatalErrorComponent";
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
import { validateEmail } from "../utils";

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
  LOGIN_READY,
  INITIAL_LOADING,
  ERROR,
}

interface IStateObject {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  state: EnumComponentState;
  stateErrorMessage: string;
  isUsernameMissing: boolean;
  isEmailMissing: boolean;
  isPasswordMissing: boolean;
  isConfirmPasswordMissing: boolean;
  loginResponseMessage: string;
  userImage: string;
}

const SignupForm: React.FC<IProps> = (props: IProps) => {
  //variables de estado
  const { getLanguageString, userDocId, createUser, userDarkMode } =
    useAppContext();

  const [stateData, setStateData] = useState<IStateObject>({
    username: props.username || "",
    email: props.email || "",
    password: props.password || "",
    confirmPassword: props.confirmPassword || "",
    state: EnumComponentState.READY,
    stateErrorMessage: "",
    isUsernameMissing: false,
    isEmailMissing: false,
    isPasswordMissing: false,
    isConfirmPasswordMissing: false,
    loginResponseMessage: "",
    userImage: props.userImage || "",
  });

  //ejecucion inicial
  useEffect(() => {
    switch (stateData.state) {
      case EnumComponentState.AWAIT_REGISTER_RESPONSE: {
        const callCreateUser = async () => {
          try {
            await createUser({
              email: stateData.email,
              password: stateData.password,
              name: stateData.username,
              image: stateData.userImage,
            });
            setStateData((_prevData) => {
              return {
                ..._prevData,
                state: EnumComponentState.LOGIN_READY,
                loginResponseMessage: "",
              };
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
        callCreateUser();
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

  useEffect(() => {}, [userDocId]);

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
    let isUsernameMissing = stateData.username.length <= 0 ? true : false;
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
      !isUsernameMissing &&
      !isPasswordMissing &&
      !isConfirmPasswordMissing &&
      !isEmailMissing &&
      stateData.password !== stateData.confirmPassword
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
        state: EnumComponentState.READY,
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
        state: EnumComponentState.AWAIT_REGISTER_RESPONSE,
      });
      return;
    }
  };

  function onUserImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      let reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setStateData({
            ...stateData,
            userImage: reader.result.toString(),
          });
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  const getString = (string: string) => {
    return getLanguageString("signupForm", string);
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
            <Box
              style={{
                display: "flex",
                flexFlow: "row",
                gap: "1rem",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Avatar
                alt="New user image"
                src={stateData.userImage ? stateData.userImage : ""}
                style={{
                  justifySelf: "center",
                }}
                sx={{ width: 50, height: 50 }}
              ></Avatar>
              <label htmlFor="contained-button-file" style={{ gridArea: "a8" }}>
                <Input
                  inputProps={{ accept: "image/*" }}
                  id="contained-button-file"
                  type="file"
                  style={{ display: "none" }}
                  onChange={onUserImageChange}
                />
                <Button variant="outlined" component="span">
                  {getString("uploadImage")}
                </Button>
              </label>
            </Box>
            <span>{stateData.loginResponseMessage}</span>
            <Button
              variant="contained"
              style={{ width: "100%" }}
              disableElevation
              type="submit"
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
              <Link to="/" style={userDarkMode ? { color: "#ffffffbf" } : {}}>
                {getString("return")}
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
      {stateData.state === EnumComponentState.LOGIN_READY ? (
        <>
          <Paper className={style.successMessageContainer}>
            <span>{getString("success")}</span>
            <Link to="/">
              <Button
                variant="contained"
                style={
                  userDarkMode
                    ? { color: "#ffffffbf", width: "100%" }
                    : { width: "100%" }
                }
                disableElevation
              >
                {getString("login")}
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
