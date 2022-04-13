import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import style from "./style.module.scss";
import React, { useCallback, useEffect } from "react";
import { IAppContextData } from "../../appContext/index.d";
import { AppContext } from "../../appContext";
import { useTranslation } from "react-i18next";
import { sections, ISection } from "../index";
interface IProps {
  toggleSidebarCallback: any;
  currentSection: string;
}

const Headerbar: React.FC<IProps> = (props: IProps) => {
  const { themeObject, userObject, userImage } = React.useContext(
    AppContext
  ) as IAppContextData;
  const { t } = useTranslation();
  const currentSectionData: ISection | undefined = sections.find((section) => {
    return section.id === props.currentSection;
  });
  return (
    <Box className={style.container}>
      <AppBar>
        <Toolbar
          className={
            themeObject.palette.mode === "dark"
              ? style.appBarDark
              : style.appBarLight
          }
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
            {currentSectionData ? t(currentSectionData.label) : ""}
          </Typography>
          <Avatar
            alt="User image"
            src={userImage}
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
