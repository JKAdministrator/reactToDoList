import React, { useState } from "react";
import style from "./style.module.scss";
import { useAppContext } from "../../context/appContext";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";

const Sidebar = ({
  isOpen,
  onChangeStateCallback,
  onSectionChangeCallback,
}) => {
  const { logoutUser, getLanguageString } = useAppContext();

  const [stateData, setStateData] = useState({
    selectedOption: {},
    openOptions: [],
  });

  const getString = (string) => {
    return getLanguageString("sidebar", string);
  };
  function handleClick(e) {
    onChangeStateCallback();
    onSectionChangeCallback(e.target.getAttribute("data-option"));
    setStateData((_prevstateData) => {
      return {
        ..._prevstateData,
        selectedOption: e.target.parentNode.getAttribute("data-option"),
      };
    });
  }

  return (
    <SwipeableDrawer
      open={isOpen}
      onClose={onChangeStateCallback}
      onOpen={onChangeStateCallback}
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
            <ListItem
              button
              divider
              onClick={handleClick}
              data-option="screenConfiguration"
              selected={
                stateData.selectedOption === "screenConfiguration"
                  ? true
                  : false
              }
            >
              <ListItemText
                primary={getString("configuration")}
                style={{ pointerEvents: "none" }}
              />
            </ListItem>
            <ListItem
              button
              divider
              onClick={handleClick}
              data-option="screenProjects"
              selected={
                stateData.selectedOption === "screenProjects" ? true : false
              }
            >
              <ListItemText
                primary={getString("projects")}
                style={{ pointerEvents: "none" }}
              />
            </ListItem>
            <ListItem
              button
              divider
              data-option="USERS"
              onClick={handleClick}
              selected={stateData.selectedOption === "USERS" ? true : false}
              disabled
            >
              <ListItemText primary="Users" style={{ pointerEvents: "none" }} />
            </ListItem>
            <ListItem
              button
              divider
              data-option="TEAMS"
              onClick={handleClick}
              selected={stateData.selectedOption === "TEAMS" ? true : false}
              disabled
            >
              <ListItemText
                primary={getString("users")}
                style={{ pointerEvents: "none" }}
              />
            </ListItem>
            <ListItem
              button
              divider
              data-option="TEAMS"
              onClick={handleClick}
              selected={stateData.selectedOption === "TEAMS" ? true : false}
              disabled
            >
              <ListItemText primary={getString("teams")} />
            </ListItem>
            <ListItem
              button
              divider
              data-option="CHATS"
              onClick={handleClick}
              selected={stateData.selectedOption === "CHATS" ? true : false}
              disabled
            >
              <ListItemText primary={getString("chats")} />
            </ListItem>
          </List>
          <List
            component="nav"
            style={{
              width: "100%",
              marginTop: "auto",
            }}
          >
            <ListItem button onClick={logoutUser}>
              <ListItemText
                primary={getString("logout")}
                style={{ pointerEvents: "none" }}
              />
            </ListItem>
          </List>
        </Paper>
      </Box>
    </SwipeableDrawer>
  );
};

export default Sidebar;
