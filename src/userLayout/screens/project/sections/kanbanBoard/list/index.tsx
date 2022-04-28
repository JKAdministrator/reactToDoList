import React, { useEffect, useState } from "react";

import style from "./style.module.scss";
import { Draggable, Droppable } from "react-beautiful-dnd";
import KanbanBoardTask from "../task";
import { Box, Paper, Stack, Skeleton } from "@mui/material";
import KanbanBoardAddButton, { EType } from "../addButton";
import Header from "../header";
import {
  IProjectResultTask,
  EnumGetProjectResultState,
  IAppContextData,
} from "../../../../../../appContext/index.d";
import { AppContext } from "../../../../../../appContext";
interface IKanbanBoardListProps {
  id: string;
  name: string;
  index: number;
  state: EnumGetProjectResultState;
  projectId: string;
  tasks: IProjectResultTask[];
  handleEditTask: (taskId: string, listId: string) => void;
  handleEditList: (listId: string) => void;
  handleDeleteList: (listId: string) => void;
  handleDeleteTask: (listId: string, taskId: string) => void;
  handleAddTask: (name: string, listId: string) => void;
}

const KanbanBoardList = (props: IKanbanBoardListProps) => {
  const handleEditTask = (taskId: string) => {
    props.handleEditTask(taskId, props.id);
  };

  const handleAddTask: (name: string) => void = (name) => {
    props.handleAddTask(name, props.id);
  };
  const handleDeleteTask: (taskId: string) => void = (taskId) => {
    props.handleDeleteTask(props.id, taskId);
  };

  return (
    <Draggable draggableId={props.id} index={props.index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          ref={provided.innerRef}
          {...provided.dragHandleProps}
        >
          <Box
            style={{ width: "18rem" }}
            className={
              props.state === EnumGetProjectResultState.LOADING
                ? style.isLoading
                : style.isReady
            }
          >
            <Paper
              elevation={0}
              style={{ padding: "0.5rem", border: "1px solid #8080802b" }}
            >
              {props.state === EnumGetProjectResultState.LOADING ? (
                <Box>
                  <Skeleton animation="wave" variant="rectangular" />
                </Box>
              ) : (
                <>
                  {" "}
                  <Header
                    label={props.name}
                    elementId={props.id}
                    handleEdit={props.handleEditList}
                    handleDelete={props.handleDeleteList}
                  ></Header>
                  <Stack spacing={{ xs: 1, sm: 2, md: 4 }}>
                    <Droppable droppableId={props.id} type="task">
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
                          {!props.tasks || props.tasks.length === 0 ? (
                            <div
                              style={{ width: "100%", height: "1rem" }}
                            ></div>
                          ) : (
                            <></>
                          )}
                          {props.tasks && props.tasks.length > 0 ? (
                            props.tasks.map(
                              (task: IProjectResultTask, index: number) => {
                                return (
                                  <KanbanBoardTask
                                    id={task.id}
                                    key={task.id}
                                    name={task.name}
                                    index={index}
                                    state={task.state}
                                    isDraggingOver={false}
                                    handleDeleteTask={handleDeleteTask}
                                    handleEdit={handleEditTask}
                                  ></KanbanBoardTask>
                                );
                              }
                            )
                          ) : (
                            <></>
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                    <KanbanBoardAddButton
                      type={EType.TASK}
                      addElementCallback={handleAddTask}
                    />
                  </Stack>
                </>
              )}
            </Paper>
          </Box>
        </div>
      )}
    </Draggable>
  );
};
export default KanbanBoardList;
