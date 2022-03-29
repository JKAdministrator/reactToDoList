import React, { useState } from "react";
import style from "./style.module.scss";
import { useAppContext } from "../context/appContext";
const Sidebar = ({ onSectionChangeCallback }) => {
  const { tryLogout, getLanguageString, userData, userDisplayName } =
    useAppContext();

  const getString = (string) => {
    return getLanguageString("sidebar", string);
  };

  const options = [
    {
      iconSrc: "./icons/sidebar/configuration.png",
      label: "configuration",
      code: "CONFIGURATION",
      childOf: "",
    },
    {
      iconSrc: "./icons/sidebar/security.png",
      label: "security",
      code: "SECURITY",
      childOf: "",
    },
    {
      iconSrc: "./icons/sidebar/users.png",
      label: "users",
      code: "USERS",
      childOf: "SECURITY",
    },
    {
      iconSrc: "./icons/sidebar/groups.png",
      label: "groups",
      code: "GROUPS",
      childOf: "SECURITY",
    },
  ];
  const [stateData, setStateData] = useState({
    selectedOption: {},
    openOptions: [],
  });

  function renderOption(option) {
    const childs = options.filter((_option) => {
      return _option.childOf === option.code;
    });

    let isOptionOpen =
      stateData.openOptions.indexOf(option.code) > -1 ? true : false;
    return (
      <li
        data-state={isOptionOpen ? "OPEN" : "CLOSED"}
        key={option.code}
        data-code={option.code}
      >
        <button type="button" onClick={handleClick}>
          <img
            src={option.iconSrc}
            alt={getString(option.label)}
            className="icon"
            name="optionIcon"
          />
          <label>{getString(option.label)}</label>
          {childs.length > 0 ? (
            <img
              src={
                isOptionOpen
                  ? "./icons/sidebar/optionOpen.png"
                  : "./icons/sidebar/optionClosed.png"
              }
              className="icon"
              name="stateIcon"
              alt={isOptionOpen ? "open" : "closed"}
            ></img>
          ) : (
            <>
              {stateData.selectedOption === option.code ? <div></div> : <></>}
            </>
          )}
        </button>
        {childs.length > 0 ? (
          <ul>
            {childs.map((suboption) => {
              return renderOption(suboption);
            })}
          </ul>
        ) : (
          <></>
        )}
      </li>
    );
  }

  function handleClick(e) {
    let li = e.target.parentNode;
    if (li.querySelectorAll("ul").length === 0) {
      onSectionChangeCallback(li.dataset.code);
      setStateData((_prevstateData) => {
        //props.onOptionChangeCallback();
        return {
          ..._prevstateData,
          selectedOption: li.dataset.code,
        };
      });
    } else {
      setStateData((_prevstateData) => {
        let newOpenOptions;
        if (li.dataset.state === "CLOSED") {
          newOpenOptions = [..._prevstateData.openOptions, li.dataset.code];
        } else {
          let index = _prevstateData.openOptions.indexOf(li.dataset.code);
          _prevstateData.openOptions.splice(index, 1);
          newOpenOptions = _prevstateData.openOptions;
        }
        return {
          ..._prevstateData,
          openOptions: newOpenOptions,
        };
      });
    }
  }

  function handleClickLogout() {
    tryLogout();
  }

  return (
    <ul className={style.rootUnsortedList}>
      <img className={style.logo} src="./logos/client.png" alt="Owner logo" />
      <span name="userName" id="usrName" className={style.username}>
        {userDisplayName}
      </span>
      {options
        .filter((option) => {
          return option.childOf === "";
        })
        .map((option) => {
          return renderOption(option);
        })}
      <li data-state="CLOSED" data-code="LOGOUT" style={{ marginTop: "auto" }}>
        <button type="button" onClick={handleClickLogout}>
          <img
            src="./icons/sidebar/logout.png"
            alt={getString("logout")}
            className="icon"
            name="optionIcon"
          />
          <label>{getString("logout")}</label>
        </button>
      </li>
    </ul>
  );
};

export default Sidebar;
