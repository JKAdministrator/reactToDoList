import React, { useEffect, useState } from "react";
import { IAppContextData } from "../../../../../../appContext/index.d";
import { AppContext } from "../../../../../../appContext";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Draggable } from "react-beautiful-dnd";
import { Card, CardContent, Paper, Typography } from "@mui/material";

interface IKanbanBoardTaskProps {
  id: string;
  label: string;
  index: number;
  isDraggingOver: boolean;
}
/*
const LiContainer = styled.li`
  background-color=${props.isDragging? 'green' : 'white'}
`;*/

const KanbanBoardTask = (props: IKanbanBoardTaskProps) => {
  const { projectId } = useParams();
  const { t } = useTranslation();
  const { userObject, setHeaderLinks } = React.useContext(
    AppContext
  ) as IAppContextData;

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
            <h3 style={{ fontSize: 14 }}>{props.label}</h3>
          </Paper>
        </div>
      )}
    </Draggable>
  );
};
export default KanbanBoardTask;
