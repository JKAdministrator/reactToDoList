import React from "react";
import Box from "@mui/material/Box";
import ProjectTabItem from "./item";
import { IProject } from "../../../../appContext/index.d";

interface IProps {
  children?: React.ReactNode;
  value: number;
  index: number;
  projects: IProject[];
  allowReopen: boolean;
  allowDelete: boolean;
  allowRename: boolean;
  allowClose: boolean;
  editCallback: any;
  openCallback: any;
}

const ProjectTabPanel: React.FC<IProps> = (props: IProps) => {
  return (
    <div
      role="tabpanel"
      hidden={props.value !== props.index}
      id={`simple-tabpanel-${props.index}`}
      aria-labelledby={`simple-tab-${props.index}`}
    >
      {props.value === props.index && (
        <Box
          style={{
            padding: "1rem 0rem",
            display: "flex",
            flexFlow: "row",
            gap: "2rem",
            maxWidth: "100%",
            flexWrap: "wrap",
          }}
        >
          {Array.from(props.projects).map((project: IProject) => {
            return (
              <ProjectTabItem
                key={project.id}
                name={project && project.name ? project.name : ""}
                id={project.id}
                allowDelete={props.allowDelete}
                allowReopen={props.allowReopen}
                allowClose={props.allowClose}
                allowRename={props.allowRename}
                editCallback={props.editCallback}
                openCallback={props.openCallback}
              />
            );
          })}
        </Box>
      )}
    </div>
  );
};

export default ProjectTabPanel;
