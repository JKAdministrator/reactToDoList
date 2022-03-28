import React, { useEffect } from "react";
import style from "./style.module.scss";
import { useAppContext } from "../../context/appContext";

export const AppContext = React.createContext();
const SectionConfiguration = () => {
  const {
    theme,
    setTheme,
    language,
    setLanguage,
    getLanguageString,
    firebaseCurrentUser,
  } = useAppContext();
  console.log("language", language);

  function onChangeThemeHandler(e) {
    console.log("onChangeThemeHandler", e);
    e.target.checked ? setTheme(`dark`) : setTheme(`light`);
  }

  function onChangeLanguageHandler(e) {
    setLanguage(e.target.value);
  }

  const getString = (string) => {
    return getLanguageString("sectionConfiguration", string);
  };
  console.log("firebaseCurrentUser", { e: firebaseCurrentUser });

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
            checked={theme === "dark" ? true : false}
          ></input>
          <label htmlFor="language">{getString("language")} :</label>
          <select
            id="language"
            name="language"
            onChange={onChangeLanguageHandler}
            defaultValue={language}
          >
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </section>

        <section className="card" name="ACCES_ACCOUNTS">
          <h2>{getString("accesAccounts")}</h2>
          <section name="USERNAME_AND_PASSWORD">
            <h3>{getString("usernameAndPassword")}</h3>
            <label htmlFor="username">{getString("username")} :</label>
            <input
              type="username"
              id="username"
              name="username"
              disabled
            ></input>
            <label htmlFor="password">{getString("password")} :</label>
            <input
              type="password"
              id="password"
              name="password"
              disabled
            ></input>
          </section>
          <section name="GOOGLE">
            <h3>Google</h3>
            <img src={firebaseCurrentUser.photoURL} alt="google user image" />
            <input
              type="text"
              disabled
              id="googleDisplayName"
              name="googleDisplayName"
              value={firebaseCurrentUser.displayName}
            ></input>
            <input
              type="text"
              disabled
              id="googleEmail"
              name="googleEmail"
              value={firebaseCurrentUser.email}
            ></input>
          </section>
        </section>
      </form>
    </>
  );
};

export default SectionConfiguration;
