import { Box, CircularProgress, Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
//import ScreeenConfiguration from "./screens/configuration";
//import ScreenProjects from "./screens/projects";
import style from "./style.module.scss";
import Headerbar from "./headerbar";
import Sidebar from "./sidebar";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { IPropsScreenProject } from "./screens/project/index.d";

export enum EnumSections {
  CONFIGURATION = "/configuration",
  PROJECTS = "/projects",
  NOT_FOUND = "/",
}
export interface ISection {
  id: EnumSections;
  label: string;
}

export const sections: ISection[] = [
  { id: EnumSections.PROJECTS, label: "screen-projects-title" },
  { id: EnumSections.CONFIGURATION, label: "screen-configuration-title" },
];

interface IStateObject {
  currentSection: EnumSections | string;
  isSidebarOpen: boolean;
}

const ScreenProject: React.LazyExoticComponent<React.FC> = React.lazy(() => {
  return import("./screens/project");
});
const ScreenProjects: React.LazyExoticComponent<React.FC> = React.lazy(() => {
  return import("./screens/projects");
});
const ScreenConfiguration: React.LazyExoticComponent<React.FC> = React.lazy(
  () => {
    return import("./screens/configuration");
  }
);
const NotFound: React.LazyExoticComponent<React.FC> = React.lazy(() => {
  return import("../notFound");
});

interface IProps {
  section: EnumSections;
}
const UserLayout: React.FC<IProps> = (props: IProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const projectId: string | undefined = params.projectId;
  console.log("userLayout url param projectId", { projectId });

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [currentSection, setCurrentSection] = useState<EnumSections | null>(
    location.pathname as EnumSections
  );

  function onSectionChange(e: EnumSections) {
    setCurrentSection(e);
  }

  function onToggleSidebarFromHeader(e: any) {
    setIsSidebarOpen((_prevValue: boolean) => {
      return !_prevValue;
    });
  }

  function onToggleSidebarFromSidebar(e: any) {
    setIsSidebarOpen((_prevValue: boolean) => {
      return !_prevValue;
    });
  }

  return (
    <Paper
      sx={{ backgroundColor: "background.default" }}
      className={style.container}
    >
      <Headerbar
        toggleSidebarCallback={onToggleSidebarFromHeader}
        currentSection={currentSection ? currentSection.toString() : ""}
      ></Headerbar>
      <Sidebar
        isOpen={isSidebarOpen}
        onChangeStateCallback={onToggleSidebarFromSidebar}
        onSectionChangeCallback={onSectionChange}
      ></Sidebar>
      <Box className={style.sectionContainer}>
        <React.Suspense
          fallback={
            <CircularProgress
              style={{ position: "absolute", top: "calc(50% - 20px)" }}
            />
          }
        >
          <Routes>
            <Route
              path="/configuration"
              element={<ScreenConfiguration />}
            ></Route>
            <Route path="/projects" element={<ScreenProjects />}></Route>
            <Route
              path="/projects/:projectId/*"
              element={<ScreenProject />}
            ></Route>
            <Route path="*" element={<NotFound />}></Route>
          </Routes>
        </React.Suspense>
      </Box>
    </Paper>
  );
};

export default UserLayout;
