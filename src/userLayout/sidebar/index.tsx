import React, { useState, useCallback } from "react";
import style from "./style.module.scss";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { AppContext } from "../../appContext";
import { IAppContextData } from "../../appContext/index.d";
import { useTranslation } from "react-i18next";
import { getAuth, signOut } from "firebase/auth";
import { sections, ISection, EnumSections } from "../index";
import { useNavigate } from "react-router-dom";
interface IProps {
  isOpen: boolean;
  onChangeStateCallback: any;
  onSectionChangeCallback: any;
}

const Sidebar: React.FC<IProps> = (props: IProps) => {
  const { t } = useTranslation();
  let navigate = useNavigate();
  //let navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState<EnumSections>();

  function handleClick(e: React.MouseEvent<HTMLElement>) {
    let sectionId = e.currentTarget.getAttribute(
      "data-option"
    ) as keyof typeof EnumSections;
    props.onChangeStateCallback(); // close the sidebar
    props.onSectionChangeCallback(sectionId); // update the section in the parent component
    //navigate(sectionId);
    setSelectedSection(EnumSections[sectionId]);
  }

  const logoutUser = useCallback(() => {
    const auth = getAuth();
    signOut(auth);
    navigate("/");
  }, []);

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
            {sections.map((section) => {
              return (
                <ListItem
                  button
                  divider
                  onClick={handleClick}
                  key={section.id}
                  data-option={section.id}
                  selected={selectedSection === section.id ? true : false}
                >
                  <ListItemText
                    primary={t(section.label)}
                    style={{ pointerEvents: "none" }}
                  />
                </ListItem>
              );
            })}
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
                primary={t("sidebar-logout")}
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
