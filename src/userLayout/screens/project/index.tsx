import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import style from "./style.module.scss";
import { IAppContextData, ISection } from "../../../appContext/index.d";
import { AppContext } from "../../../appContext";
import { useTranslation } from "react-i18next";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import NotFound from "../../../notFound";
import { CircularProgress, Tab, Tabs } from "@mui/material";
import KanbanBoard from "./sections/kanbanBoard";
import { IPropsScreenProject } from "./index.d";
import FolderIcon from "@mui/icons-material/Folder";
import Chat from "./sections/chat";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {children}
    </div>
  );
};

const ScreenProject: React.FC = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { t } = useTranslation();
  const { userObject, setHeaderLinks } = React.useContext(
    AppContext
  ) as IAppContextData;
  const [tabPanelCurrentValue, setTabPanelCurrentValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabPanelCurrentValue(newValue);
  };

  useEffect(() => {
    setHeaderLinks((_prevHeadersLinks: ISection[]) => {
      return [
        {
          id: "projects",
          label: "main-section-projects",
          link: "/projects",
          icon: <FolderIcon fontSize="small" />,
        } as ISection,
        {
          id: "projectId",
          label: projectId,
          link: ``,
          icon: <FolderIcon fontSize="small" />,
        } as ISection,
      ];
    });
  }, []);

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabPanelCurrentValue}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab
            label={t("main-section-projects-project-board")}
            {...a11yProps(0)}
          />
          <Tab
            label={t("main-section-projects-project-chat")}
            {...a11yProps(1)}
          />
        </Tabs>
      </Box>

      <TabPanel value={tabPanelCurrentValue} index={0}>
        <KanbanBoard />
      </TabPanel>

      <TabPanel value={tabPanelCurrentValue} index={1}>
        <Chat />
      </TabPanel>
    </>
  );
};

export default ScreenProject;
