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
    editCallback,
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
            maxWidth: "100%",
            flexWrap: "wrap",
          }}
        >
          {Array.from(projects).map((project) => {
            return (
              <ProjectTabItem
                key={project.id}
                name={project.name}
                id={project.id}
                allowDelete={allowDelete}
                allowReopen={allowReopen}
                allowClose={allowClose}
                allowRename={allowRename}
                editCallback={editCallback}
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
