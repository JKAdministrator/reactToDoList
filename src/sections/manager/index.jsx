import { Box, Card, Paper } from "@mui/material";
import React, { useState } from "react";
import Sidebar from "../../sidebar";
import SectionConfiguration from "../configuration";
import style from "./style.module.scss";
const SectionManager = () => {
  const [currentSection, setCurrentSection] = useState("");

  function onSectionChange(e) {
    setCurrentSection(e);
  }

  function getSectionHTMLElement() {
    switch (currentSection) {
      case "ACCOUNT": {
        console.log("adding section ACCOUNT");
        return <SectionConfiguration></SectionConfiguration>;
      }
      default: {
        return <></>;
      }
    }
  }

  return (
    <Paper
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
      }}
      sx={{ backgroundColor: "background.default" }}
    >
      <Sidebar onSectionChangeCallback={onSectionChange}></Sidebar>
      {getSectionHTMLElement()}
    </Paper>
  );
};

export default SectionManager;
