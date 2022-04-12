import React, { useState } from "react";
import style from "./style.module.scss";
import { useAppContext } from "../../context/appContext";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { EnumSections } from "../index";

interface IProps {
  isOpen: boolean;
  onChangeStateCallback: any;
  onSectionChangeCallback: any;
}

const Sidebar: React.FC<IProps> = (props: IProps) => {
  const { logoutUser, getLanguageString } = useAppContext();
  const [selectedOption, setSelectedOption] = useState<EnumSections>();

  const getString = (string: string): string => {
    return getLanguageString("sidebar", string);
  };
  function handleClick(e: React.MouseEvent<HTMLElement>) {
    let optionValue = e.currentTarget?.getAttribute(
      "data-option"
    ) as keyof typeof EnumSections;
    props.onChangeStateCallback();
    props.onSectionChangeCallback(optionValue);
    setSelectedOption(EnumSections[optionValue]);
  }

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
            <ListItem
              button
              divider
              onClick={handleClick}
              data-option={EnumSections.CONFIGURATION}
              selected={
                selectedOption === EnumSections.CONFIGURATION ? true : false
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
              data-option={EnumSections.PROJECTS}
              selected={selectedOption === EnumSections.PROJECTS ? true : false}
            >
              <ListItemText
                primary={getString("projects")}
                style={{ pointerEvents: "none" }}
              />
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
