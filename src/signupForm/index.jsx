import React, { useEffect, useState } from "react";
import LoaderAnimation from "../loaderAnimation";
import style from "./style.module.scss";
import { AppProvider, useAppContext } from "../context/appContext";
import FatalErrorComponent from "../fatalErrorComponent";
import { Outlet, Link } from "react-router-dom";

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
          <label htmlFor="email" className={style.label}>
            {getString("username")} :
          </label>
          <input
            type="text"
            name="username"
            id="username"
            value={stateData.username}
            onChange={changeHandler}
            autoFocus
            required
            className={`${stateData.isUsernameMissing ? "error" : ""}`}
          />

          <label htmlFor="username" className={style.label}>
            {getString("email")} :
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={stateData.email}
            onChange={changeHandler}
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
          <label htmlFor="confirmPassword" className={style.label}>
            {getString("confirmPassword")} :
          </label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            value={stateData.confirmPassword}
            onChange={changeHandler}
            required
            className={`${stateData.isConfirmPasswordMissing ? "error" : ""}`}
          />
          <span name="loginResponse">{stateData.loginResponseMessage}</span>
          <button
            type="button"
            className={style.primaryButton}
            onClick={handleSubmit}
            name="signupButton"
          >
            {getString("signupButton")}
          </button>

          <div className={style.secondaryButtons}>
            <Link to="/" className={style.secondaryButton} name="return">
              {getString("return")}
            </Link>
          </div>
        </>
      ) : (
        <></>
      )}
      {stateData.state === "INITIAL_LOADING" ||
      stateData.state === "AWAIT_REGISTER_RESPONSE" ? (
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
      {stateData.state === "LOGIN_READY" ? (
        <>
          <div className={style.successMessageContainer}>
            <span>{getString("success")}</span>
            <Link to="/" name="login">
              {getString("login")}
            </Link>
          </div>
        </>
      ) : (
        <></>
      )}
    </form>
  );
};
export default SignupForm;
