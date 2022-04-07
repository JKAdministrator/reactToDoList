import React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
//import { useAppContext } from "../../../../context/appContext";
import ProjectTabItem from "./item";
//export const AppContext = React.createContext();

export default function ProjectTabPanel(props) {
  const {
    value,
    index,
    projects,
    allowDelete,
    allowReopen,
    allowClose,
    allowRename,
  } = props;
  //const { userDarkMode } = useAppContext();

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && (
        <Box
          style={{
            padding: "1rem 0rem",
            display: "flex",
            flexFlow: "row",
            gap: "2rem",
          }}
        >
          {Array.from(projects).map((project) => {
            console.log("project", { project });
            return (
              <ProjectTabItem
                key={project.id}
                name={project.name}
                allowDelete={allowDelete}
                allowReopen={allowReopen}
                allowClose={allowClose}
                allowRename={allowRename}
              />
            );
          })}
        </Box>
      )}
    </div>
  );
}

ProjectTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  projects: PropTypes.any,
};
