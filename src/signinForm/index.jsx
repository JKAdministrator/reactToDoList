import React, { useEffect, useState } from "react";
import LoaderAnimation from "../loaderAnimation";
import style from "./style.module.scss";
import { AppProvider, useAppContext } from "../context/appContext";
import FatalErrorComponent from "../fatalErrorComponent";
import GoogleLoginButton from "../googleLoginButton";
import { Outlet, Link } from "react-router-dom";
const SigninForm = (props) => {
  //variables de estado
  const { getLanguageString, tryLogin } = useAppContext();

  const [stateData, setStateData] = useState({
    username: props.username || "",
    password: props.password || "",
    state: "READY",
    stateErrorMessage: "",
    isUsernameMissing: false,
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
            email: stateData.username,
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
    let isUsernameMissing =
      stateData.username.toString().length <= 0 ? true : false;
    let isPasswordMissing =
      stateData.password.toString().length <= 0 ? true : false;
    if (isUsernameMissing || isPasswordMissing) {
      setStateData({ ...stateData, isPasswordMissing, isUsernameMissing });
      return;
    } else {
      setStateData({
        ...stateData,
        isPasswordMissing,
        isUsernameMissing,
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
    <form
      action="submit"
      id="LoginForm"
      onSubmit={handleSubmit}
      className={style.form + " card"}
    >
      <div className={style.imagesContainer}>
        <img
          src="./logos/company.png"
          alt="company logo"
          className="companyLogo"
        />
        <img
          src="./logos/client.png"
          alt="client logo"
          className="clientLogo"
        />
      </div>
      {stateData.state === "READY" ? (
        <>
          <h1>{getString("title")}</h1>
          <label htmlFor="username" className={style.label}>
            {getString("email")} :
          </label>
          <input
            type="email"
            name="username"
            id="username"
            value={stateData.username}
            onChange={changeHandler}
            autoFocus
            required
            className={`${stateData.isUsernameMissing ? "error" : ""}`}
          />
          <label htmlFor="password" className={style.label}>
            {getString("password")} :
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={stateData.password}
            onChange={changeHandler}
            required
            className={`${stateData.isPasswordMissing ? "error" : ""}`}
          />
          <span name="loginResponse">{stateData.loginResponseMessage}</span>
          <button
            type="button"
            className={style.primaryButton}
            onClick={handleSubmit}
            name="login"
          >
            {getString("login")}
          </button>

          <div className={style.secondaryButtons}>
            <Link
              to="/recover"
              className={style.secondaryButton}
              name="recover"
            >
              {getString("forgot")}
            </Link>

            <Link to="/signup" className={style.secondaryButton} name="signup">
              {getString("signup")}
            </Link>
          </div>

          <div name="orSeparator">
            <span className={style.line}></span>
            <span className={style.text}>{getString("or")}</span>
            <span className={style.line}></span>
          </div>
          <GoogleLoginButton
            className={style.socialNetworkButton}
          ></GoogleLoginButton>
        </>
      ) : (
        <></>
      )}
      {stateData.state === "INITIAL_LOADING" ||
      stateData.state === "AWAIT_LOGIN_RESPONSE" ? (
        <div className={style.loader}>
          <LoaderAnimation />
        </div>
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
    </form>
  );
};
export default SigninForm;
