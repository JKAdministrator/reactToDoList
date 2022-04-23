import React, { useState } from "react";
import style from "./style.module.scss";
import { Draggable, Droppable } from "react-beautiful-dnd";
import KanbanBoardTask from "../task";
import { ITask } from "../index.d";
import { Box, Paper, Stack, Typography } from "@mui/material";

interface IKanbanBoardColumnProps {
  id: string;
  label: string;
  tasks: ITask[];
  index: number;
}

const KanbanBoardColumn = (props: IKanbanBoardColumnProps) => {
  return (
    <Draggable draggableId={props.id} index={props.index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          ref={provided.innerRef}
          {...provided.dragHandleProps}
        >
          <Box style={{ width: "18rem" }}>
            <Paper elevation={0} style={{ padding: "0.5rem" }}>
              <Typography
                variant="h6"
                component="h6"
                style={{ textAlign: "center" }}
              >
                {props.label}
              </Typography>
              <Stack>
                <Droppable droppableId={props.id}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{
                        gap: "1rem",
                        display: "flex",
                        flexFlow: "column",
                      }}
                    >
                      {props.tasks.map((task: ITask, index: number) => {
                        return (
                          <KanbanBoardTask
                            id={task.id}
                            key={task.id}
                            label={task.label}
                            index={index}
                            isDraggingOver={false}
                          ></KanbanBoardTask>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
                <div style={{ cursor: "pointer", pointerEvents: "all" }}>
                  asasas
                </div>
              </Stack>
            </Paper>
          </Box>
        </div>
      )}
    </Draggable>
  );
};
export default KanbanBoardColumn;
