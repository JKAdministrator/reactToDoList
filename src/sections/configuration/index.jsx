import React, { useEffect } from "react";
import style from "./style.module.scss";
import { useAppContext } from "../../context/appContext";
import SectionConfigurationAccesAccountGoogle from "./accesManagers/google";
import SectionConfigurationAccesAccountUsernameAndPassword from "./accesManagers/usernameAndPassword";

export const AppContext = React.createContext();
const SectionConfiguration = () => {
  const {
    userLanguage,
    userTheme,
    userDisplayName,
    getLanguageString,
    userDocId,
    userData,
    updateName,
    updateTheme,
    updateLanguage,
  } = useAppContext();

  function onChangeThemeHandler(e) {
    console.log("onChangeThemeHandler", e);
    let newValue = e.target.checked ? `dark` : `light`;
    //setTheme(newValue);
    updateTheme(newValue, userDocId);
  }

  function onChangeLanguageHandler(e) {
    updateLanguage(e.target.value, userDocId);
  }

  const getString = (string) => {
    return getLanguageString("sectionConfiguration", string);
  };

  function handleChangeName(e) {
    updateName(e.target.value, null);
  }
  function handleBlurName(e) {
    updateName(e.target.value, userDocId);
  }

  return (
    <>
      <form className={style.container}>
        <h1>{getString("title")}</h1>

        <section className="card" name="CONFIGURATION">
          <h2>{getString("application")}</h2>
          <label htmlFor="darkMode">{getString("darkMode")} :</label>
          <input
            type="checkbox"
            name="darkMode"
            id="darkMode"
            itemID="darkMode"
            onChange={onChangeThemeHandler}
            checked={userTheme === "dark" ? true : false}
          ></input>
          <label htmlFor="language">{getString("language")} :</label>
          <select
            id="language"
            name="language"
            onChange={onChangeLanguageHandler}
            defaultValue={userLanguage}
          >
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </section>

        <section className="card" name="ACCES_ACCOUNTS">
          <h2>{getString("accesAccounts")}</h2>
          <SectionConfigurationAccesAccountGoogle></SectionConfigurationAccesAccountGoogle>
          <SectionConfigurationAccesAccountUsernameAndPassword></SectionConfigurationAccesAccountUsernameAndPassword>
        </section>

        <section className="card" name="MY_DATA">
          <h2>{getString("myData")}Mis Datos</h2>
          <label htmlFor="username">{getString("name")} :</label>
          <input
            name="username"
            id="username"
            type="text"
            value={userDisplayName}
            onChange={handleChangeName}
            onBlur={handleBlurName}
          />
          <label htmlFor="userId">{getString("userId")} :</label>
          <span name="userId" id="userId">
            {userDocId}
          </span>
          <label htmlFor="creationDate">{getString("creationDate")} :</label>
          <span name="creationDate" id="creationDate">
            {userData.user
              ? new Date(userData.user.creationDate._seconds * 1000).toString()
              : ""}
          </span>
        </section>
      </form>
    </>
  );
};

export default SectionConfiguration;
