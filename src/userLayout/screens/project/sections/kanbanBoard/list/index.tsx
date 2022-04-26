import React, { useCallback, useState } from "react";
import style from "./style.module.scss";
import { Draggable, Droppable } from "react-beautiful-dnd";
import KanbanBoardTask from "../task";
import { ITask } from "../index.d";
import { Box, IconButton, Paper, Stack, Typography } from "@mui/material";
import KanbanBoardAddButton, { EType } from "../addButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Header from "../header";
interface IKanbanBoardListProps {
  id: string;
  label: string;
  tasks: ITask[];
  index: number;
  addTaskCallback: (name: string, columnId: String) => void;
  handleEditTask: (taskId: string, listId: string) => void;
  handleEditList: (listId: string) => void;
  handleDeleteTask: (taskId: string, listId: string) => void;
  handleDeleteList: (listId: string) => void;
}

const KanbanBoardList = (props: IKanbanBoardListProps) => {
  const addTaskCallback = useCallback((name: string) => {
    props.addTaskCallback(name, props.id);
  }, []);
  const handleDeleteTask = (taskId: string) => {
    props.handleDeleteTask(taskId, props.id);
  };
  const handleEditTask = (taskId: string) => {
    props.handleEditTask(taskId, props.id);
  };
  return (
    <Draggable draggableId={props.id} index={props.index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          ref={provided.innerRef}
          {...provided.dragHandleProps}
        >
          <Box style={{ width: "18rem" }}>
            <Paper
              elevation={0}
              style={{ padding: "0.5rem", border: "1px solid #8080802b" }}
            >
              <Header
                label={props.label}
                elementId={props.id}
                handleEdit={props.handleEditList}
                handleDelete={props.handleDeleteList}
              ></Header>

              <Stack spacing={{ xs: 1, sm: 2, md: 4 }}>
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
                      {props.tasks.length === 0 ? (
                        <div style={{ width: "100%", height: "1rem" }}></div>
                      ) : (
                        <></>
                      )}
                      {props.tasks.map((task: ITask, index: number) => {
                        return (
                          <KanbanBoardTask
                            id={task.id}
                            key={task.id}
                            label={task.label}
                            index={index}
                            isDraggingOver={false}
                            handleDelete={handleDeleteTask}
                            handleEdit={handleEditTask}
                          ></KanbanBoardTask>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
                <KanbanBoardAddButton
                  type={EType.TASK}
                  addElementCallback={addTaskCallback}
                />
              </Stack>
            </Paper>
          </Box>
        </div>
      )}
    </Draggable>
  );
};
export default KanbanBoardList;
