import React, { useEffect, useState } from "react";
import LoaderAnimation from "../loaderAnimation";
import style from "./style.module.scss";
import { useAppContext } from "../context/appContext";
import FatalErrorComponent from "../fatalErrorComponent";
import GoogleLoginButton from "../googleLoginButton";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const LoginForm = (props) => {
  //variables de estado
  const { firebaseHttpsCallableFunctions, firebaseLoginFuncions } =
    useAppContext();

  const [stateData, setStateData] = useState({
    username: props.username || "",
    password: props.password || "",
    state: "INITIAL_LOADING",
    stateErrorMessage: "",
    servers: "",
    server: props.server || "",
    database: props.database || "",
    isUsernameMissing: false,
    isPasswordMissing: false,
    loginResponseMessage: "",
  });

  //funcion para obtener la lista de servidores y bases de datos
  const getDatabases = async () => {
    let response, defaultServer, defaultDatabase;
    try {
      response = await firebaseHttpsCallableFunctions.getDatabases();
      defaultServer = response.data.servers.find(
        (server) => server.id === response.data.defaults.server
      );
      defaultDatabase = defaultServer.databases.find(
        (database) => database.id === response.data.defaults.database
      );
    } catch (e) {
      throw e.toString();
    }
    return { servers: response.data.servers, defaultServer, defaultDatabase };
  };

  const loginWithEmailAndPassword = async (username, password) => {
    try {
      let user = await firebaseLoginFuncions.signInWithEmailAndPassword(
        username,
        password
      );
      return user;
    } catch (e) {
      throw e.message;
    }
  };

  //ejecucion inicial
  useEffect(() => {
    switch (stateData.state) {
      case "AWAIT_LOGIN_RESPONSE": {
        loginWithEmailAndPassword(stateData.username, stateData.password)
          .then((result) => {
            console.log("LOGIN WITH USERNAME AND PASSWORD SUCCESS!!!", {
              result,
            });
          })
          .catch((e) => {
            setStateData((_prevData) => {
              return {
                ..._prevData,
                state: "READY",
                loginResponseMessage: e.toString(),
              };
            });
          });
        break;
      }
      case "INITIAL_LOADING": {
        getDatabases()
          .then((data) => {
            //coloca el servidor y base de datos default
            setStateData((_prevData) => {
              console.log(data);
              return {
                ..._prevData,
                servers: data.servers,
                server: data.defaultServer,
                database: data.defaultDatabase,
                state: "READY",
                stateErrorMessage: "",
              };
            });
          })
          .catch((e) => {
            setStateData((_prevData) => {
              return {
                ..._prevData,
                state: "ERROR",
                stateErrorMessage: e.toString(),
              };
            });
          });
        break;
      }
      default:
        break;
    }

    //foco en el campo actual, empezando por el username
  }, [stateData.state]);

  // graba el nuevo estado del componente cuando se detecta un cambio en algun input
  const changeHandler = (e) => {
    let name = e.target.name;
    let value = "";
    switch (name) {
      case "server": {
        value = stateData.servers.find((server) => {
          return server.id === e.target.value;
        });
        break;
      }
      case "database": {
        value = stateData.server.databases.find((database) => {
          return database.id === e.target.value;
        });
        break;
      }
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

  //html retornado
  return (
    <>
      <form
        action="submit"
        id="LoginForm"
        onSubmit={handleSubmit}
        className={style.form}
      >
        <div className={style.imagesContainer}>
          <img
            src="./companyLogo.png"
            alt="company logo"
            className="companyLogo"
          />
          <img
            src="./clientLogo.png"
            alt="client logo"
            className="clientLogo"
          />
        </div>
        {stateData.state === "READY" ? (
          <>
            <h1>LOGIN</h1>
            <label htmlFor="username" className={style.label}>
              Email :
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
            <label htmlFor="password" className={style.label}>
              Password :
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
            <label htmlFor="server">Server :</label>
            <select
              name="server"
              id="server"
              value={stateData.server.id}
              onChange={changeHandler}
              required
            >
              {stateData.servers.map((server, index) => {
                return (
                  <option key={server.id} value={server.id}>
                    {server.name}
                  </option>
                );
              })}
            </select>
            <label htmlFor="database">Database :</label>
            <select
              name="database"
              id="database"
              value={stateData.database.id}
              onChange={changeHandler}
              required
            >
              {stateData.server.databases.map((database) => {
                return (
                  <option key={database.id} value={database.id}>
                    {database.name}
                  </option>
                );
              })}
            </select>
            <span name="loginResponse">{stateData.loginResponseMessage}</span>
            <button
              type="button"
              className={style.primaryButton}
              onClick={handleSubmit}
              name="login"
            >
              LOGIN
            </button>
            <button
              type="button"
              className={style.secondaryButton}
              name="forgot"
            >
              Forgot Password?
            </button>
            <button
              type="button"
              className={style.secondaryButton}
              name="signup"
            >
              Sign Up
            </button>
            <div name="orSeparator">
              <span className={style.line}></span>
              <span className={style.text}>OR</span>
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
          <>
            <div className={style.loader}>
              <LoaderAnimation />
            </div>
          </>
        ) : (
          <></>
        )}
        {stateData.state === "ERROR" ? (
          <>
            <FatalErrorComponent
              mensaje={stateData.stateErrorMessage}
            ></FatalErrorComponent>
          </>
        ) : (
          <></>
        )}
      </form>
    </>
  );
};
export default LoginForm;
