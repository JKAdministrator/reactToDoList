import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import style from "./style.module.scss";
import { IAppContextData, ISection } from "../../../../../appContext/index.d";
import { AppContext } from "../../../../../appContext";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import FolderIcon from "@mui/icons-material/Folder";
import ChatIcon from "@mui/icons-material/Chat";
const Chat = () => {
  const { projectId } = useParams();
  const { t } = useTranslation();
  const { setHeaderLinks } = React.useContext(AppContext) as IAppContextData;
  useEffect(() => {
    setHeaderLinks((_prevHeadersLinks: ISection[]) => {
      return [
        {
          id: "projects",
          label: "main-section-projects",
          link: "/projects",
          icon: <FolderIcon fontSize="small" />,
        } as ISection,
        {
          id: "projectId",
          label: projectId,
          link: ``,
          icon: <FolderIcon fontSize="small" />,
        } as ISection,
        {
          id: "project-board",
          label: "main-section-projects-project-chat",
          link: `/projects/${projectId}/chat`,
          icon: <ChatIcon fontSize="small" />,
        } as ISection,
      ];
    });
  }, []);
  return (
    <>
      <Box className={style.container}>
        pending... project [{projectId?.toString()}]
      </Box>
    </>
  );
};
export default Chat;
