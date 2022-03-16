import React, { useEffect, useState } from "react";
import LoaderAnimation from "../loaderAnimation";
import style from "./style.module.scss";

class LoginFormState {
  static get READY() {
    return "READY";
  }
  static get LOADING() {
    return "LOADING";
  }
  static get ERROR() {
    return "ERROR";
  }
}

const LoginForm = (props) => {
  //variables de estado
  const [stateData, setStateData] = useState({
    username: props.username || "",
    password: props.password || "",
    state: LoginFormState.LOADING,
    servers: "",
    server: props.server || "",
    database: props.database || "",
    isUsernameMissing: false,
    isPasswordMissing: false,
  });

  //funcion para obtener la lista de servidores y bases de datos
  const gerServers = async () => {
    const response = await fetch("./json/loginServers.json");
    const data = await response.json();
    return data;
  };

  //ejecucion inicial
  useEffect(() => {
    //foco en el campo actual, empezando por el username
    gerServers().then((data) => {
      let defaultServer = data.servers.find(
        (server) => server.id === data.defaults.server
      );

      let defaultDatabase = defaultServer.databases.find(
        (database) => database.id === data.defaults.database
      );

      //coloca el servidor y base de datos default
      setStateData((_prevData) => {
        return {
          ..._prevData,
          servers: data.servers,
          server: defaultServer,
          database: defaultDatabase,
          state: LoginFormState.READY,
        };
      });
    });
  }, []);

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
        state: LoginFormState.LOADING,
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

        {stateData.state === LoginFormState.READY ? (
          <>
            <h1>LOGIN</h1>
            <label htmlFor="username" className={style.label}>
              Username :
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
          </>
        ) : (
          <></>
        )}
        {stateData.state === LoginFormState.LOADING ? (
          <>
            <div className={style.loader}>
              <LoaderAnimation />
            </div>
          </>
        ) : (
          <></>
        )}
      </form>
    </>
  );
};
export default LoginForm;
