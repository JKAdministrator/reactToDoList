import React, { useEffect, useState } from "react";
import { IAppContextData } from "../../../../../../appContext/index.d";
import { AppContext } from "../../../../../../appContext";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Draggable } from "react-beautiful-dnd";
import style from "./style.module.scss";
import {
  Box,
  Card,
  CardContent,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Header from "../header";
interface IKanbanBoardTaskProps {
  id: string;
  label: string;
  index: number;
  isDraggingOver: boolean;
  handleEdit: (elementId: string) => void;
  handleDelete: (elementId: string) => void;
}
/*
const LiContainer = styled.li`
  background-color=${props.isDragging? 'green' : 'white'}
`;*/

const KanbanBoardTask = (props: IKanbanBoardTaskProps) => {
  return (
    <Draggable draggableId={props.id} index={props.index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          data-is-dragging={snapshot.isDragging}
        >
          <Paper elevation={1} style={{ padding: "0.5rem" }}>
            <Header
              label={props.label}
              elementId={props.id}
              handleEdit={props.handleEdit}
              handleDelete={props.handleDelete}
            />
          </Paper>
        </div>
      )}
    </Draggable>
  );
};
export default KanbanBoardTask;
