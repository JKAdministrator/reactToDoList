import React, { useState } from "react";
import Sidebar from "../../sidebar";
import SectionConfiguration from "../configuration";
import style from "./style.module.scss";
const SectionManager = () => {
  const [currentSection, setCurrentSection] = useState("");

  function onSectionChange(e) {
    console.log("onSectionChange");
    setCurrentSection(e);
  }

  function getSectionHTMLElement() {
    switch (currentSection) {
      case "CONFIGURATION": {
        return <SectionConfiguration></SectionConfiguration>;
      }
      default: {
        return <></>;
      }
    }
  }

  return (
    <div className={style.container}>
      <Sidebar onSectionChangeCallback={onSectionChange}></Sidebar>
      {getSectionHTMLElement()}
    </div>
  );
};

export default SectionManager;
