import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Box,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import { useAppContext } from "../../../context/appContext";
import style from "./style.module.scss";
import React from "react";

const Headerbar = ({ toggleSidebarCallback, currentSection }) => {
  const { getLanguageString, darkMode, userImage } = useAppContext();

  const getString = (section, string) => {
    return getLanguageString(section, string);
  };

  switch (currentSection) {
    default:
      break;
  }

  return (
    <Box className={style.container}>
      <AppBar>
        <Toolbar className={darkMode ? style.appBarDark : style.appBarLight}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleSidebarCallback}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {currentSection ? getString(currentSection, "title") : ""}
          </Typography>
          <Avatar
            alt="User image"
            src={userImage ? userImage : ""}
            style={{
              justifySelf: "center",
            }}
            sx={{ width: 40, height: 40 }}
          ></Avatar>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Headerbar;
