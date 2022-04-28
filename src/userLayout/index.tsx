import { Box, CircularProgress, Paper } from "@mui/material";
import React, { useState } from "react";
import style from "./style.module.scss";
import Headerbar from "./headerbar";
import { Route, Routes, useLocation } from "react-router-dom";

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
  const [currentSection] = useState<EnumSections | null>(
    location.pathname as EnumSections
  );

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
