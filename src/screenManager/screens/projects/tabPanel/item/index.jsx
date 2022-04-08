import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useAppContext } from "../../../../../context/appContext";
import style from "./style.module.scss";
import {
  Button,
  Card,
  CircularProgress,
  ListItemIcon,
  Menu,
  MenuItem,
} from "@mui/material";
import { blueGrey, grey } from "@mui/material/colors";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

import DeleteIcon from "@mui/icons-material/Delete";
import FolderOffIcon from "@mui/icons-material/FolderOff";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import EditIcon from "@mui/icons-material/Edit";
export const AppContext = React.createContext();

const options = [
  {
    id: "DELETE",
    label: "delete",
    allowDelete: true,
    icon: <DeleteIcon></DeleteIcon>,
  },
  {
    id: "RENAME",
    label: "rename",
    allowRename: true,
    icon: <EditIcon></EditIcon>,
  },
  {
    id: "CLOSE",
    label: "close",
    allowClose: true,
    icon: <FolderOffIcon></FolderOffIcon>,
  },
  {
    id: "OPEN",
    label: "reopen",
    allowReopen: true,
    icon: <CreateNewFolderIcon></CreateNewFolderIcon>,
  },
];

export default function ProjectTabItem(props) {
  const {
    name,
    id,
    openCallback,
    allowReopen,
    allowDelete,
    allowRename,
    allowClose,
    initialState,
    editCallback,
  } = props;

  const {
    userDarkMode,
    getLanguageString,
    closeProject,
    deleteProject,
    openProject,
  } = useAppContext();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [state, setState] = React.useState(initialState);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClick = (event) => {
    let optionId = event.target.getAttribute("data-option");
    switch (optionId) {
      case "CLOSE": {
        setAnchorEl(null);
        setState("CHANGING");
        closeProject(id);
        break;
      }
      case "OPEN": {
        setAnchorEl(null);
        setState("CHANGING");
        openProject(id);
        break;
      }
      case "DELETE": {
        setAnchorEl(null);
        setState("CHANGING");
        deleteProject(id);
        break;
      }
      case "RENAME": {
        setAnchorEl(null);
        editCallback(id);
        break;
      }
      default: {
        setAnchorEl(null);
        break;
      }
    }
  };

  function getString(string) {
    return getLanguageString("projectsPanelItem", string);
  }

  return (
    <Card
      className={style.projectCard}
      elevation={state === "CHANGING" ? 0 : 1}
    >
      {state === "CHANGING" ? (
        <CircularProgress
          style={{ position: "absolute", top: "calc(50% - 20px)" }}
        ></CircularProgress>
      ) : (
        <>
          <Button onClick={openCallback}>
            <Typography
              variant="body1"
              sx={
                userDarkMode ? { color: grey[100] } : { color: blueGrey[500] }
              }
            >
              {name}
            </Typography>
          </Button>
          <Box className={style.controlsContainer}>
            <div>
              <Button
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
              >
                <MoreHorizIcon></MoreHorizIcon>
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClick}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                {options
                  .filter((option) => {
                    return (
                      option.allowReopen === allowReopen ||
                      option.allowClose === allowClose ||
                      option.allowDelete === allowDelete ||
                      option.allowRename === allowRename
                    );
                  })
                  .map((option) => {
                    return (
                      <MenuItem
                        onClick={handleMenuClick}
                        key={option.id}
                        data-option={option.id}
                      >
                        <ListItemIcon style={{ pointerEvents: "none" }}>
                          {option.icon}
                        </ListItemIcon>
                        {getString(option.label)}
                      </MenuItem>
                    );
                  })}
              </Menu>
            </div>
          </Box>
        </>
      )}
    </Card>
  );
}
