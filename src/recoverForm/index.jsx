import React, { useEffect, useState } from "react";
import LoaderAnimation from "../loaderAnimation";
import style from "./style.module.scss";
import { AppProvider, useAppContext } from "../context/appContext";
import FatalErrorComponent from "../fatalErrorComponent";
import { Outlet, Link } from "react-router-dom";

const RecoverForm = (props) => {
  //variables de estado
  const { getLanguageString, tryRecover, userDocId } = useAppContext();

  const [stateData, setStateData] = useState({
    email: props.email || "",
    state: "READY",
    stateErrorMessage: "",
    isEmailMissing: false,
    loginResponseMessage: "",
  });

  //ejecucion inicial
  useEffect(async () => {
    switch (stateData.state) {
      case "AWAIT_RECOVER_RESPONSE": {
        try {
          await tryRecover({
            email: stateData.email,
          });

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
            {getString("email")} :
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={stateData.email}
            onChange={changeHandler}
            required
            className={`${stateData.isEmailMissing ? "error" : ""}`}
          />
          <span name="loginResponse">{stateData.loginResponseMessage}</span>
          <button
            type="button"
            className={style.primaryButton}
            onClick={handleSubmit}
            name="signupButton"
          >
            {getString("recoverButton")}
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
      stateData.state === "AWAIT_RECOVER_RESPONSE" ? (
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
      {stateData.state === "RECOVER_READY" ? (
        <>
          <div className={style.successMessageContainer}>
            <span>{getString("success")}</span>
            <Link to="/" name="login">
              {getString("return")}
            </Link>
          </div>
        </>
      ) : (
        <></>
      )}
    </form>
  );
};
export default RecoverForm;
