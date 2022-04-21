import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import style from "./style.module.scss";
import { IAppContextData, ISection } from "../../../appContext/index.d";
import { AppContext } from "../../../appContext";
import { useTranslation } from "react-i18next";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import NotFound from "../../../notFound";
import { CircularProgress } from "@mui/material";
import KanbanBoard from "./sections/kanbanBoard";
import { IPropsScreenProject } from "./index.d";
import FolderIcon from "@mui/icons-material/Folder";
import Chat from "./sections/chat";
const ScreenProject: React.FC = () => {
  let navigate = useNavigate();
  const { projectId } = useParams();
  const { t } = useTranslation();
  const { userObject, setHeaderLinks } = React.useContext(
    AppContext
  ) as IAppContextData;

  return (
    <>
      <button
        onClick={() => {
          navigate(`/projects/${projectId}/board`);
        }}
      >
        GO TO BOARD
      </button>
      <React.Suspense
        fallback={
          <CircularProgress
            style={{ position: "absolute", top: "calc(50% - 20px)" }}
          />
        }
      >
        <Routes>
          <Route path={`/chat`} element={<Chat />}></Route>
          <Route path={`/board`} element={<KanbanBoard />}></Route>
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </React.Suspense>
    </>
  );
};
export default ScreenProject;
