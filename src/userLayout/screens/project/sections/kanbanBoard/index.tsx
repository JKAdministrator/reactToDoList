import React, { useCallback, useEffect, useState } from "react";
import style from "./style.module.scss";
import { IAppContextData, ISection } from "../../../../../appContext/index.d";
import { AppContext } from "../../../../../appContext";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import FolderIcon from "@mui/icons-material/Folder";
import {
  DragDropContext,
  Droppable,
  DropResult,
  ResponderProvided,
} from "react-beautiful-dnd";
import { IColumn, ITask } from "./index.d";
import KanbanBoardColumn from "./list";
import KanbanBoardAddButton, { EType } from "./addButton";
import KanbanBoardList from "./list";

const dataColumns: IColumn[] = [
  {
    id: "c1",
    label: "To Do (c1)",
    tasks: [
      {
        id: "t1",
        label: "Fix the login screen view on mobile (t1)",
      } as ITask,
      {
        id: "t2",
        label: "Add color selector to kanban lists (t2)",
      } as ITask,
    ],
  } as IColumn,
  {
    id: "c2",
    label: "Working (c2)",
    tasks: [
      {
        id: "t3",
        label: "Add color selector to kanban cards (t3)",
      } as ITask,
      {
        id: "t4",
        label: "Make chat user images bigger (t4)",
      } as ITask,
      {
        id: "t5",
        label: "Automatic logout on session timeout (t5)",
      } as ITask,
    ],
  } as IColumn,
  {
    id: "c3",
    label: "Testing (c3)",
    tasks: [
      {
        id: "t6",
        label: "Profile: Dark mode not working on IOS (t6)",
      } as ITask,
      {
        id: "t7",
        label: "Team CRUD operations (t7)",
      } as ITask,
      {
        id: "t8",
        label: "Allow Edit username (t8)",
      } as ITask,
    ],
  } as IColumn,
  {
    id: "c4",
    label: "Done (c4)",
    tasks: [
      {
        id: "t9",
        label: "Hide alert from Database when testing (t9)",
      } as ITask,
    ],
  } as IColumn,
];

const KanbanBoard = () => {
  const { projectId } = useParams();
  const { setHeaderLinks } = React.useContext(AppContext) as IAppContextData;

  const [columns, updateColumns] = useState(dataColumns);

  const handleOnDragEnd = (result: DropResult, provided: ResponderProvided) => {
    if (!result.destination) return;

    const {
      destination: { droppableId: desDroppableId, index: desIndex },
      source: { droppableId: srcDroppableId, index: srcIndex },
      type,
    } = result;

    const newColumns = Array.from(columns);
    if (srcDroppableId === desDroppableId && desDroppableId === projectId) {
      //changing columns
      const [reorderedColumn] = newColumns.splice(srcIndex, 1);
      newColumns.splice(desIndex, 0, reorderedColumn);
    } else {
      //changing rows
      const srcColumn = newColumns.find((c: IColumn) => {
        return c.id === srcDroppableId;
      }) as IColumn;
      const desColumn = newColumns.find((c: IColumn) => {
        return c.id === desDroppableId;
      }) as IColumn;
      //remove the item from the source column
      const [reorderedTask] = srcColumn.tasks.splice(srcIndex, 1);
      //add the item to the new column
      desColumn.tasks.splice(desIndex, 0, reorderedTask);
    }
    updateColumns(newColumns);
  };

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
          label: "main-section-projects-project-board",
          link: `/projects/${projectId}/board`,
          icon: <FolderIcon fontSize="small" />,
        } as ISection,
      ];
    });
  }, []);

  const handleDeleteTask = (taskId: string, listId: string) => {
    console.log("deleting task ", taskId, " from list ", listId);
    const newColumns = Array.from(columns);
    const column: IColumn = newColumns.find((c: IColumn) => {
      return c.id === listId;
    }) as IColumn;
    const taskToDeleteIndex = column.tasks.findIndex((t: ITask) => {
      return t.id === taskId;
    }) as number;
    column.tasks.splice(taskToDeleteIndex, 1);
    updateColumns(newColumns);
  };
  const handleDeleteList = (listId: string) => {
    console.log("deleting list ", listId);
    const newColumns = Array.from(columns);
    const columnToDeleteIndex = newColumns.findIndex((c: IColumn) => {
      return c.id === listId;
    }) as number;
    newColumns.splice(columnToDeleteIndex, 1);
    updateColumns(newColumns);
  };
  const handleEditTask = (taskId: string, listId: string) => {
    console.log("editing task ", taskId, " from list ", listId);
  };
  const handleEditList = (listId: string) => {
    console.log("editing list ", listId);
  };

  const addTaskCallback: (name: string, columnId: string) => void = (
    name,
    columnId
  ) => {
    updateColumns((_prevColumns: IColumn[]) => {
      //get a copy of the columns
      const newColumnsData: IColumn[] = Array.from(_prevColumns);
      //get the column
      const columSelected = newColumnsData.find((c: IColumn) => {
        return c.id === columnId;
      }) as IColumn;
      //get a new task id (to-do : the idd must be getted from the server)
      const newTaskId: string =
        columSelected.tasks.length > 0
          ? columSelected.tasks[columSelected.tasks.length - 1].id
          : "c";
      // add the task to column
      columSelected.tasks.push({
        id: newTaskId + "-c",
        label: name,
      } as ITask);
      return newColumnsData;
    });
  };

  const addColumnCallback: (name: string) => void = (name) => {
    //to-do the id must be getted from the server
    updateColumns((_prevColumns) => {
      const lastColumn = _prevColumns[_prevColumns.length - 1].id;
      return [
        ..._prevColumns,
        {
          id: lastColumn + "-c",
          label: name,
          tasks: [],
        } as IColumn,
      ];
    });
  };

  return (
    <>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable
          droppableId={projectId as string}
          type="list"
          direction="horizontal"
        >
          {(provided) => (
            <div
              className={style.board}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {columns.map((c: IColumn, index: number) => {
                return (
                  <KanbanBoardList
                    key={c.id}
                    id={c.id}
                    label={c.label}
                    tasks={c.tasks}
                    index={index}
                    addTaskCallback={addTaskCallback}
                    handleDeleteList={handleDeleteList}
                    handleDeleteTask={handleDeleteTask}
                    handleEditList={handleEditList}
                    handleEditTask={handleEditTask}
                  />
                );
              })}
              {provided.placeholder}
              <KanbanBoardAddButton
                type={EType.COLUMN}
                addElementCallback={addColumnCallback}
              />
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
};
export default KanbanBoard;
