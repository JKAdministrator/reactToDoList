import React, { useEffect, useState } from "react";
import { EnumGetProjectResultState } from "../../../../../../appContext/index.d";
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
  Skeleton,
  Typography,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Header from "../header";
interface IKanbanBoardTaskProps {
  id: string;
  name: string;
  index: number;
  state: EnumGetProjectResultState;
  isDraggingOver: boolean;
  handleEdit: (elementId: string) => void;
  handleDeleteTask: (elementId: string) => void;
}
/*
const LiContainer = styled.li`
  background-color=${props.isDragging? 'green' : 'white'}
`;*/

//const KanbanBoardTask = (props: IKanbanBoardTaskProps) => {

const KanbanBoardTask = (props: IKanbanBoardTaskProps) => {
  return (
    <Draggable draggableId={props.id} index={props.index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          data-is-dragging={snapshot.isDragging}
          className={
            props.state === EnumGetProjectResultState.LOADING
              ? style.isLoading
              : style.isReady
          }
        >
          <Paper elevation={1} style={{ padding: "0.5rem" }}>
            {props.state === EnumGetProjectResultState.LOADING ? (
              <Box>
                <Skeleton animation="wave" />
              </Box>
            ) : (
              <Header
                label={props.name}
                elementId={props.id}
                handleEdit={props.handleEdit}
                handleDelete={props.handleDeleteTask}
              />
            )}
          </Paper>
        </div>
      )}
    </Draggable>
  );
};
export default KanbanBoardTask;
