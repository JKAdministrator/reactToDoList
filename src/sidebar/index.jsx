import React, { useState } from "react";
import style from "./style.module.scss";
import { useAppContext } from "../context/appContext";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

const Sidebar = ({ onSectionChangeCallback }) => {
  const { tryLogout, getLanguageString, userData, userDisplayName } =
    useAppContext();

  const getString = (string) => {
    return getLanguageString("sidebar", string);
  };

  const [stateData, setStateData] = useState({
    selectedOption: {},
    openOptions: [],
  });

  function handleClick(e) {
    console.log("e.target", { t: e.target.parentNode });
    onSectionChangeCallback(e.target.parentNode.getAttribute("data-option"));
    setStateData((_prevstateData) => {
      return {
        ..._prevstateData,
        selectedOption: e.target.parentNode.getAttribute("data-option"),
      };
    });
  }

  function handleClickLogout() {
    tryLogout();
  }

  return (
    <Box
      style={{
        height: "100%",
        width: "max-content",
        minWidth: "9rem",
      }}
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
            selected={stateData.selectedOption == "ACCOUNT" ? true : false}
          >
            <ListItemText
              data-option="ACCOUNT"
              primary="Account"
              secondary={userDisplayName}
            />
          </ListItem>
          <ListItem
            button
            divider
            data-option="PROYECTS"
            onClick={handleClick}
            selected={stateData.selectedOption == "PROYECTS" ? true : false}
            disabled
          >
            <ListItemText primary="Proyects" />
          </ListItem>
          <ListItem
            button
            divider
            data-option="USERS"
            onClick={handleClick}
            selected={stateData.selectedOption == "USERS" ? true : false}
            disabled
          >
            <ListItemText primary="Users" />
          </ListItem>
          <ListItem
            button
            divider
            data-option="TEAMS"
            onClick={handleClick}
            selected={stateData.selectedOption == "TEAMS" ? true : false}
            disabled
          >
            <ListItemText primary="Teams" />
          </ListItem>
          <ListItem
            button
            divider
            data-option="CHATS"
            onClick={handleClick}
            selected={stateData.selectedOption == "CHATS" ? true : false}
            disabled
          >
            <ListItemText primary="Chats" />
          </ListItem>
        </List>
        <List
          component="nav"
          style={{
            width: "100%",
            marginTop: "auto",
          }}
        >
          <ListItem button onClick={handleClickLogout}>
            <ListItemText primary={getString("logout")} />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
};

export default Sidebar;
