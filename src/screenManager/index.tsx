import { Box, Paper } from "@mui/material";

import React, { useState } from "react";
import ScreeenConfiguration from "./screens/configuration";
import ScreenProjects from "./screens/projects";
import style from "./style.module.scss";
import Headerbar from "./headerbar";
import Sidebar from "./sidebar";

export enum EnumSections {
  CONFIGURATION = "screenConfiguration",
  PROJECTS = "screenProjects",
}

interface IStateObject {
  currentSection: EnumSections;
  isSidebarOpen: boolean;
}

const ScreenManager: React.FC = () => {
  const [stateData, setStateData] = useState<IStateObject>({
    currentSection: EnumSections.CONFIGURATION,
    isSidebarOpen: false,
  });

  function onSectionChange(e: EnumSections) {
    setStateData((_prevData) => {
      return {
        ..._prevData,
        currentSection: e,
      };
    });
  }

  function onToggleSidebarFromHeader(e: any) {
    setStateData((_prevValue) => {
      return {
        ..._prevValue,
        isSidebarOpen: !_prevValue.isSidebarOpen,
      };
    });
  }

  function onToggleSidebarFromSidebar(e: any) {
    setStateData((_prevValue) => {
      return {
        ..._prevValue,
        isSidebarOpen: !_prevValue.isSidebarOpen,
      };
    });
  }

  function getSectionHTMLElement() {
    switch (stateData.currentSection) {
      case EnumSections.CONFIGURATION: {
        return <ScreeenConfiguration></ScreeenConfiguration>;
      }
      case EnumSections.PROJECTS: {
        return <ScreenProjects></ScreenProjects>;
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
        currentSection={stateData.currentSection}
      ></Headerbar>
      <Sidebar
        isOpen={stateData.isSidebarOpen}
        onChangeStateCallback={onToggleSidebarFromSidebar}
        onSectionChangeCallback={onSectionChange}
      ></Sidebar>
      <Box className={style.sectionContainer}>{getSectionHTMLElement()}</Box>
    </Paper>
  );
};

export default ScreenManager;
