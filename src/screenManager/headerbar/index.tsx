import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useAppContext } from "../../context/appContext";
import style from "./style.module.scss";
import React from "react";

interface IProps {
  toggleSidebarCallback: any;
  currentSection: string;
}

const Headerbar: React.FC<IProps> = (props: IProps) => {
  const { getLanguageString, userDarkMode, userImage } = useAppContext();

  const getString = (section: string, string: string): string => {
    return getLanguageString(section, string);
  };

  return (
    <Box className={style.container}>
      <AppBar>
        <Toolbar
          className={userDarkMode ? style.appBarDark : style.appBarLight}
        >
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={props.toggleSidebarCallback}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {props.currentSection
              ? getString(props.currentSection, "title")
              : ""}
          </Typography>
          <Avatar
            alt="User image"
            src={
              userImage && userImage !== "" ? userImage : "./noUserImage.png"
            }
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
