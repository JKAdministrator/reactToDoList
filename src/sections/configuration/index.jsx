import React, { useEffect } from "react";
import style from "./style.module.scss";
import { useAppContext } from "../../context/appContext";

export const AppContext = React.createContext();
const SectionConfiguration = () => {
  const { theme, setTheme, language, setLanguage } = useAppContext();
  console.log("language", language);
  function onChangeThemeHandler(e) {
    console.log("onChangeThemeHandler", e);
    e.target.checked ? setTheme(`dark`) : setTheme(`light`);
  }

  function onChangeLanguageHandler(e) {
    setLanguage(e.target.value);
  }

  return (
    <>
      <form className={style.container}>
        <h1>Configuration</h1>

        <section className="card" name="CONFIGURATION">
          <h2>App Configuration</h2>
          <label htmlFor="darkMode">Dark mode :</label>
          <input
            type="checkbox"
            name="darkMode"
            id="darkMode"
            itemID="darkMode"
            onChange={onChangeThemeHandler}
            checked={theme === "dark" ? true : false}
          ></input>
          <label htmlFor="language">Language :</label>
          <select
            id="language"
            name="language"
            onChange={onChangeLanguageHandler}
            value={language}
            defaultValue={language}
          >
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </section>
      </form>
    </>
  );
};

export default SectionConfiguration;
