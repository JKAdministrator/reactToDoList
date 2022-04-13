import React, { useState, useCallback } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import style from "./style.module.scss";
import ProjectTabPanel from "./tabPanel";
import { Fab, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ProjectPopup from "./projectPopup";
import { IAppContextData, IProject } from "../../../appContext/index.d";
import { AppContext } from "../../../appContext";
import { useTranslation } from "react-i18next";

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

  const { t } = useTranslation();
  const { userObject } = React.useContext(AppContext) as IAppContextData;

  const openProjects = userObject
    ? userObject.userProjects.filter((p: IProject) => {
        return p.isOpen ? true : false;
      })
    : [];
  const closedProjects = userObject
    ? userObject.userProjects.filter((p: IProject) => {
        return !p.isOpen ? true : false;
      })
    : [];

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setStateObject((_prevValue) => {
      return {
        ..._prevValue,
        value: newValue,
      };
    });
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
              label={
                t("screen-projects-open") + " (" + openProjects.length + ")"
              }
              {...a11yProps(0)}
            />
            <Tab
              label={
                t("screen-projects-closed") + " (" + closedProjects.length + ")"
              }
              {...a11yProps(1)}
            />
          </Tabs>
        </Box>
        <ProjectTabPanel
          value={stateObject.value}
          index={0}
          projects={openProjects}
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
          projects={closedProjects}
          allowClose={false}
          allowDelete={true}
          allowReopen={true}
          allowRename={false}
          editCallback={editCallback}
          openCallback={openProjectClickCallback}
        ></ProjectTabPanel>
      </Box>
      <Tooltip title={t("screen-projects-btnNewTooltip")}>
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
