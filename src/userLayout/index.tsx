import { Box, CircularProgress, Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
//import ScreeenConfiguration from "./screens/configuration";
//import ScreenProjects from "./screens/projects";
import style from "./style.module.scss";
import Headerbar from "./headerbar";
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
const RedirectToUserLayout: React.LazyExoticComponent<React.FC> = React.lazy(
  () => {
    return import("./redirectToUserLayout");
  }
);
interface IProps {
  section: EnumSections;
}
const UserLayout: React.FC<IProps> = (props: IProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const projectId: string | undefined = params.projectId;

  const [currentSection, setCurrentSection] = useState<EnumSections | null>(
    location.pathname as EnumSections
  );

  function onSectionChange(e: EnumSections) {
    setCurrentSection(e);
  }

  return (
    <Paper
      sx={{ backgroundColor: "background.default" }}
      className={style.container}
    >
      <Headerbar
        currentSection={currentSection ? currentSection.toString() : ""}
      ></Headerbar>
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
            <Route path="/signup" element={<RedirectToUserLayout />}></Route>
            <Route path="/recover" element={<RedirectToUserLayout />}></Route>
            <Route path="/signin" element={<RedirectToUserLayout />}></Route>
            <Route path="/login" element={<RedirectToUserLayout />}></Route>
            <Route path="/" element={<ScreenProject />}></Route>
            <Route path="*" element={<NotFound />}></Route>
          </Routes>
        </React.Suspense>
      </Box>
    </Paper>
  );
};

export default UserLayout;
