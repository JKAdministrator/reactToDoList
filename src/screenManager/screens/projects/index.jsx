import React, { useState, useCallback } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useAppContext } from "../../../context/appContext";
import style from "./style.module.scss";
import ProjectTabPanel from "./tabPanel";
import { Fab, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ProjectPopup from "./projectPopup";
export const AppContext = React.createContext();

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function ScreenProjects() {
  const [value, setValue] = useState(0);
  const [projectPopupState, setProjectPopupState] = useState({
    isOpen: false,
    isEdit: false,
    projectId: "",
  });

  const { getLanguageString, userOpenProjects, userClosedProjects } =
    useAppContext();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const getString = (string) => {
    return getLanguageString("screenProjects", string);
  };

  const newProjectClickCallback = useCallback((e) => {
    setProjectPopupState((prevState) => {
      return { ...prevState, isOpen: true, isEdit: false };
    });
  }, []);

  const editCallback = useCallback((_projectId) => {
    setProjectPopupState((prevState) => {
      return {
        ...prevState,
        isOpen: true,
        isEdit: true,
        projectId: _projectId,
      };
    });
  }, []);

  const openProjectClickCallback = useCallback((e) => {}, []);

  function handleCloseProjectPopup() {
    setProjectPopupState((prevState) => {
      return { ...prevState, isOpen: false };
    });
  }

  return (
    <>
      <Box className={style.container}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={value} onChange={handleChange} aria-label="Project tabs">
            <Tab
              label={getString("open") + " (" + userOpenProjects.length + ")"}
              {...a11yProps(0)}
            />
            <Tab
              label={
                getString("closed") + " (" + userClosedProjects.length + ")"
              }
              {...a11yProps(1)}
            />
          </Tabs>
        </Box>
        <ProjectTabPanel
          value={value}
          index={0}
          projects={userOpenProjects}
          openProjectClickCallback={openProjectClickCallback}
          allowClose={true}
          allowDelete={false}
          allowReopen={false}
          allowRename={true}
          editCallback={editCallback}
        ></ProjectTabPanel>
        <ProjectTabPanel
          value={value}
          index={1}
          projects={userClosedProjects}
          openProjectClickCallback={openProjectClickCallback}
          allowClose={false}
          allowDelete={true}
          allowReopen={true}
          allowRename={false}
          editCallback={editCallback}
        ></ProjectTabPanel>
      </Box>
      <Tooltip title={getString("btnNewTooltip")}>
        <Fab
          color="primary"
          aria-label="add"
          className={style.addButton}
          onClick={newProjectClickCallback}
        >
          <AddIcon></AddIcon>
        </Fab>
      </Tooltip>
      <ProjectPopup
        handleClose={handleCloseProjectPopup}
        open={projectPopupState.isOpen}
        isEdit={projectPopupState.isEdit}
        projectId={projectPopupState.projectId}
      ></ProjectPopup>
    </>
  );
}
