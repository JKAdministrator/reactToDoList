import React, { useState, useCallback } from "react";
import style from "./style.module.scss";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { AppContext } from "../../appContext";
import { IAppContextData, ISection } from "../../appContext/index.d";
import { useTranslation } from "react-i18next";
import { getAuth, signOut } from "firebase/auth";
import { sections, EnumSections } from "../index";
import { useNavigate, useParams } from "react-router-dom";
import { ListItemButton, ListItemIcon } from "@mui/material";
import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import ChatIcon from "@mui/icons-material/Chat";
interface IProps {
  isOpen: boolean;
  onChangeStateCallback: any;
  onSectionChangeCallback: any;
}

const Sidebar: React.FC<IProps> = (props: IProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { projectId } = useParams();
  const { setHeaderLinks, headerLinks } = React.useContext(
    AppContext
  ) as IAppContextData;

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    console.log("click en sidebar ", { projectId });
  };

  return (
    <SwipeableDrawer
      open={props.isOpen}
      onClose={props.onChangeStateCallback}
      onOpen={props.onChangeStateCallback}
    >
      <Box
        style={{
          height: "100%",
          width: "max-content",
          minWidth: "9rem",
        }}
        className={style.sideBar}
      >
        <Paper
          style={{
            width: "100%",
            height: "100%",
            borderLeft: "none",
            borderTop: "none",
            borderBottom: "none",
            borderRadius: "0px",
            display: "flex",
            flexFlow: "column",
            alignItems: "flex-start",
            justifyContent: "flex-start",
          }}
        >
          <List
            component="nav"
            style={{
              width: "100%",
            }}
          >
            <ListItem disablePadding onClick={handleClick}>
              <ListItemButton>
                <ListItemIcon>
                  <ViewKanbanIcon type="small" />
                </ListItemIcon>
                <ListItemText primary={t("project-sidebar-board")} />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding onClick={handleClick}>
              <ListItemButton>
                <ListItemIcon>
                  <ChatIcon type="small" />
                </ListItemIcon>
                <ListItemText primary={t("project-sidebar-chat")} />
              </ListItemButton>
            </ListItem>
          </List>
        </Paper>
      </Box>
    </SwipeableDrawer>
  );
};

export default Sidebar;
