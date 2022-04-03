import { Box, Paper } from "@mui/material";

import React, { useState } from "react";
import SectionConfiguration from "../configuration";
import style from "./style.module.scss";
import Headerbar from "./headerbar";
import Sidebar from "./sidebar";

const SectionManager = () => {
  const [currentSection, setCurrentSection] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  function onSectionChange(e) {
    setCurrentSection(e);
  }

  function onToggleSidebarFromHeader(e) {
    setIsSidebarOpen((_prevValue) => {
      return !_prevValue;
    });
  }

  function onToggleSidebarFromSidebar(e) {
    setIsSidebarOpen((_prevValue) => {
      return !_prevValue;
    });
  }

  function getSectionHTMLElement() {
    switch (currentSection) {
      case "sectionConfiguration": {
        return <SectionConfiguration></SectionConfiguration>;
      }
      default: {
        return <></>;
      }
    }
  }

  return (
    <Paper
      sx={{ backgroundColor: "background.default" }}
      className={style.container}
    >
      <Headerbar
        toggleSidebarCallback={onToggleSidebarFromHeader}
        currentSection={currentSection}
      ></Headerbar>
      <Sidebar
        isOpen={isSidebarOpen}
        onChangeStateCallback={onToggleSidebarFromSidebar}
        onSectionChangeCallback={onSectionChange}
      ></Sidebar>
      <Box className={style.sectionContainer}>{getSectionHTMLElement()}</Box>
    </Paper>
  );
};

export default SectionManager;
