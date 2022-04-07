import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useAppContext } from "../../../../../context/appContext";
import style from "./style.module.scss";
import { Button, Card, Menu, MenuItem } from "@mui/material";
import { blueGrey, grey } from "@mui/material/colors";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

export const AppContext = React.createContext();

const options = [
  { id: "DELETE", label: "delete", allowDelete: true },
  { id: "RENAME", label: "rename", allowRename: true },
  { id: "CLOSE", label: "close", allowClose: true },
  { id: "REOPEN", label: "reopen", allowReopen: true },
];

export default function ProjectTabItem(props) {
  const {
    name,
    openCallback,
    allowReopen,
    allowDelete,
    allowRename,
    allowClose,
  } = props;
  const { userDarkMode, getLanguageString, closeProject } = useAppContext();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    closeProject();
  };

  function getString(string) {
    return getLanguageString("projectsPanelItem", string);
  }
  return (
    <Card className={style.projectCard}>
      <Button onClick={openCallback}>
        <Typography
          variant="body1"
          sx={userDarkMode ? { color: grey[100] } : { color: blueGrey[500] }}
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
            onClose={handleClose}
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
                    onClick={handleClose}
                    key={option.id}
                    data-option={option.id}
                  >
                    {getString(option.label)}
                  </MenuItem>
                );
              })}
          </Menu>
        </div>
      </Box>
    </Card>
  );
}
