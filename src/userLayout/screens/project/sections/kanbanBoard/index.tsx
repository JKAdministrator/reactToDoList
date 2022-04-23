import React, { useEffect, useState } from "react";
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
import KanbanBoardColumn from "./column";

const dataColumns: IColumn[] = [
  {
    id: "c1",
    label: "Col1 (c1)",
    tasks: [
      {
        id: "t1",
        label: "Gary Goodspeed (t1)",
      } as ITask,
      {
        id: "t2",
        label: "Little Cato (t2)",
      } as ITask,
    ],
  } as IColumn,
  {
    id: "c2",
    label: "Col2 (c2)",
    tasks: [
      {
        id: "t3",
        label: "KVN (t3)",
      } as ITask,
      {
        id: "t4",
        label: "Mooncake (t4)",
      } as ITask,
      {
        id: "t5",
        label: "Quinn Ergon (t5)",
      } as ITask,
    ],
  } as IColumn,
  {
    id: "c3",
    label: "Col3 (c3)",
    tasks: [
      {
        id: "t6",
        label: "KVN (t6)",
      } as ITask,
      {
        id: "t7",
        label: "Mooncake (t7)",
      } as ITask,
      {
        id: "t8",
        label: "Quinn Ergon (t8)",
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
      destination,
      destination: { droppableId: desDroppableId, index: desIndex },
      source,
      source: { droppableId: srcDroppableId, index: srcIndex },
      draggableId,
      type,
    } = result;
    console.table({
      srcDroppableId,
      srcIndex,
      desDroppableId,
      desIndex,
      draggableId,
    });

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
    /*
    const items = Array.from(characters);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    updateCharacters(items);
*/
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

  return (
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
                <KanbanBoardColumn
                  key={c.id}
                  id={c.id}
                  label={c.label}
                  tasks={c.tasks}
                  index={index}
                ></KanbanBoardColumn>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
export default KanbanBoard;
