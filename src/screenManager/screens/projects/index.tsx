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

interface IStateObject {
  value: number;
  isOpen: boolean;
  isEdit: boolean;
  projectId: string;
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const ScreenProjects = () => {
  const [stateObject, setStateObject] = useState<IStateObject>({
    value: 0,
    isOpen: false,
    isEdit: false,
    projectId: "",
  });

  const { getLanguageString, userOpenProjects, userClosedProjects } =
    useAppContext();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setStateObject((_prevValue) => {
      console.log("handleChange ", { _prevValue, newValue });
      return {
        ..._prevValue,
        value: newValue,
      };
    });
  };

  const getString = (string: string): string => {
    return getLanguageString("screenProjects", string);
  };

  const newProjectClickCallback = useCallback(() => {
    setStateObject((prevState) => {
      return { ...prevState, isOpen: true, isEdit: false };
    });
  }, []);

  const editCallback = useCallback((_projectId) => {
    setStateObject((prevState) => {
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
    setStateObject((prevState) => {
      return { ...prevState, isOpen: false };
    });
  }

  return (
    <>
      <Box className={style.container}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={stateObject.value}
            onChange={handleChange}
            aria-label="Project tabs"
          >
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
          value={stateObject.value}
          index={0}
          projects={userOpenProjects}
          allowClose={true}
          allowDelete={false}
          allowReopen={false}
          allowRename={true}
          editCallback={editCallback}
          openCallback={openProjectClickCallback}
        ></ProjectTabPanel>

        <ProjectTabPanel
          value={stateObject.value}
          index={1}
          projects={userClosedProjects}
          allowClose={false}
          allowDelete={true}
          allowReopen={true}
          allowRename={false}
          editCallback={editCallback}
          openCallback={openProjectClickCallback}
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
        open={stateObject.isOpen}
        isEdit={stateObject.isEdit}
        projectId={stateObject.projectId}
      ></ProjectPopup>
    </>
  );
};
export default ScreenProjects;
