import React, { useEffect, useState } from "react";
import style from "./style.module.scss";
import { useAppContext } from "../../../../context/appContext";
import LoaderAnimation from "../../../../loaderAnimation";

export const AppContext = React.createContext();
const SectionConfigurationAccesAccountUsernameAndPassword = () => {
  const { getLanguageString, userData } = useAppContext();

  const [dataObject, setDataObject] = useState({
    displayName: "",
    email: "",
    state: "LOADING",
  });

  useEffect(() => {
    let loginData = userData.logins.find((l) => {
      return l.source === "usernameAndPassword";
    });
    console.log("loginData usernameAndPassword", { loginData });
    if (loginData) {
      setDataObject((_prevData) => {
        return { ..._prevData, ...loginData, state: "READY" };
      });
    } else {
      setDataObject((_prevData) => {
        return { ..._prevData, ...loginData, state: "EMPTY" };
      });
    }
  }, []);

  const getString = (string) => {
    return getLanguageString(
      "sectionConfiguration/accesAccounts/usernameAndPassword",
      string
    );
  };

  function handleDeleteClick(e) {
    setDataObject((_prevData) => {
      return { ..._prevData, state: "DELETING" };
    });
  }

  return (
    <>
      {dataObject.state === "READY" || dataObject.state === "DELETING" ? (
        <section className={style.section}>
          <h3>{getString("usernameAndPassword")}</h3>
          <label htmlFor="username">{getString("username")} :</label>
          <span type="username" id="username" name="username">
            {dataObject ? dataObject.email : ""}
          </span>
          <label htmlFor="password">{getString("password")} :</label>
          <span id="password" name="password">
            {dataObject?.password ? "*****" : ""}
          </span>
          <label htmlFor="credentialId">{getString("id")} :</label>
          <span id="credentialId" name="credentialId">
            {dataObject ? dataObject.loginDocId : ""}
          </span>
          <button type="button" onClick={handleDeleteClick} name="delete">
            <img
              src="./icons/common/delete.png"
              className="icon"
              alt="delete account"
            ></img>
          </button>

          {dataObject.state === "DELETING" ? (
            <div className={style.loaderContainer}>
              <LoaderAnimation></LoaderAnimation>
            </div>
          ) : (
            <></>
          )}
        </section>
      ) : (
        <></>
      )}

      {dataObject.state === "LOADING" ? (
        <div className={style.loaderContainer}>
          <LoaderAnimation></LoaderAnimation>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default SectionConfigurationAccesAccountUsernameAndPassword;
