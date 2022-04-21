import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Breadcrumbs,
  Button,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import style from "./style.module.scss";
import React, { useCallback, useEffect } from "react";
import { IAppContextData, ISection } from "../../appContext/index.d";
import { AppContext } from "../../appContext";
import { useTranslation } from "react-i18next";
import { sections } from "../index";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Link, Navigate, useNavigate } from "react-router-dom";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import FolderIcon from "@mui/icons-material/Folder";
import PersonIcon from "@mui/icons-material/Person";
import { getAuth, signOut } from "firebase/auth";
interface IProps {
  toggleSidebarCallback: any;
  currentSection: string;
}
const links: ISection[] = [
  {
    id: "configuration",
    label: "main-section-configuration",
    link: "/configuration",
    icon: <PersonIcon type="small" />,
  } as ISection,
  {
    id: "projects",
    label: "main-section-projects",
    link: "/projects",
    icon: <FolderIcon type="small" />,
  } as ISection,
  {
    id: "logout",
    label: "main-section-logout",
    link: "/projects",
    icon: <Logout type="small" />,
  } as ISection,
];
const Headerbar: React.FC<IProps> = (props: IProps) => {
  const { themeObject, userImage, headerLinks, setHeaderLinks } =
    React.useContext(AppContext) as IAppContextData;

  const { t } = useTranslation();
  const navigate = useNavigate();

  const onLinkButtonClick = (e: React.MouseEvent<HTMLElement>) => {
    let selectedId: string = e.currentTarget.getAttribute(
      "data-option"
    ) as string;
    let selectedLink: ISection = headerLinks?.find((l) => {
      return l.id === selectedId;
    }) as ISection;
    console.log("headerbar link click", { e, selectedId });
    if (selectedId === "logout") {
      const auth = getAuth();
      signOut(auth);
      navigate("/signin");
    } else {
      console.log("headerbar link click", {
        e,
        selectedId,
        selectedLink,
        headerLinks,
      });
      navigate(selectedLink.link);
    }
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
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
              disabled={
                headerLinks &&
                headerLinks[0].id === "projects" &&
                headerLinks.length > 1
                  ? false
                  : true
              }
            >
              <MenuIcon />
            </IconButton>
            <Breadcrumbs
              aria-label="breadcrumb"
              style={{ marginRight: "auto" }}
              separator="›"
            >
              {headerLinks?.map((headerLink: ISection) => {
                return (
                  <Button
                    data-option={headerLink.id}
                    key={headerLink.id}
                    onClick={onLinkButtonClick}
                    disabled={headerLink.link.length > 0 ? false : true}
                  >
                    {t(headerLink.label)}
                  </Button>
                );
              })}
            </Breadcrumbs>

            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <Avatar
                alt="User image"
                src={userImage}
                style={{
                  justifySelf: "center",
                }}
                sx={{ width: 40, height: 40 }}
              ></Avatar>
            </IconButton>
          </Toolbar>
        </AppBar>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {links.map((l: ISection) => {
          return (
            <MenuItem
              onClick={onLinkButtonClick}
              data-option={l.id}
              data-option-link={l.link}
              key={l.id}
            >
              <ListItemIcon>{l.icon}</ListItemIcon>
              {t(l.label)}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};

export default Headerbar;
