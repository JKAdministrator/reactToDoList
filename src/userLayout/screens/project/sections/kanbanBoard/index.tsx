import React, { useCallback, useEffect, useState } from "react";
import style from "./style.module.scss";
import {
  EnumGetProjectResultState,
  IAppContextData,
  IProjectResultList,
  IProjectResultTask,
  ISection,
} from "../../../../../appContext/index.d";
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
import KanbanBoardAddButton, { EType } from "./addButton";
import KanbanBoardList from "./list";
import { StringMap } from "i18next";

const KanbanBoard = () => {
  const { projectId } = useParams();

  const [temId, setTempId] = useState(0);

  const {
    setHeaderLinks,
    createKanbanList,
    createKanbanTask,
    deleteKanbanTask,
    deleteKanbanList,
    getProject,
    resortKanbanLists,
    resortKanbanTasks,
    getKanbanList,
  } = React.useContext(AppContext) as IAppContextData;

  const [lists, setLists] = useState<IProjectResultList[]>([]);

  //initial load of all lists and tasks
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

    getProject(projectId as string).then((result) => {
      console.log("getProject result", { result });
      const _kanbanLists = Array.from(result.lists);
      Promise.all(
        _kanbanLists.map((l) => {
          return getKanbanList(projectId as string, l.id);
        })
      ).then((results) => {
        setLists((_prevValue: IProjectResultList[]) => {
          _kanbanLists.forEach((kl) => {
            const listData = results.find((rl) => {
              return rl.id === kl.id;
            }) as IProjectResultList;
            kl.tasks = listData.tasks;
          });
          return _kanbanLists;
        });
      });
    });
  }, []);

  const handleOnDragEnd = (result: DropResult, provided: ResponderProvided) => {
    if (!result.destination) return;

    const {
      destination: { droppableId: desDroppableId, index: desIndex },
      source: { droppableId: srcDroppableId, index: srcIndex },
      type,
      draggableId: itemId,
    } = result;

    console.log("handleOnDragEnd", {
      desDroppableId,
      desIndex,
      srcDroppableId,
      srcIndex,
      type,
      itemId,
    });

    const newColumns = Array.from(lists);

    if (type === "list") {
      //changing columns
      const [reorderedColumn] = newColumns.splice(srcIndex, 1);
      newColumns.splice(desIndex, 0, reorderedColumn);
      //do the same on server
      resortKanbanLists(projectId as string, srcIndex, desIndex);
    } else if (type === "task") {
      //changing rows
      const srcColumn = newColumns.find((c) => {
        return c.id === srcDroppableId;
      }) as IProjectResultList;
      const desColumn = newColumns.find((c) => {
        return c.id === desDroppableId;
      }) as IProjectResultList;
      //remove the item from the source column
      const [reorderedTask] = srcColumn.tasks.splice(srcIndex, 1);
      //add the item to the new column
      desColumn.tasks.splice(desIndex, 0, reorderedTask);

      //do the same on server
      resortKanbanTasks(
        projectId as string,
        srcDroppableId, //id origin list
        desDroppableId, // id destination list
        srcIndex, //where to remove item from the origin list
        desIndex, // where to put item on the destination list
        itemId // id of the task to move
      );
    }
    setLists(newColumns);
  };

  const handleDeleteList = (listId: string) => {
    setLists((_prevLists) => {
      const newLists = Array.from(_prevLists);
      const deleteList = newLists.find((l) => {
        return l.id === listId;
      }) as IProjectResultList;
      deleteList.state = EnumGetProjectResultState.LOADING;
      return newLists;
    });
    deleteKanbanList(projectId as string, listId).then((response) => {
      setLists((_prevLists) => {
        return _prevLists.filter((l: IProjectResultList) => {
          return l.id !== listId;
        }) as IProjectResultList[];
      });
    });
  };

  const handleDeleteTask = (listId: string, taskId: string) => {
    //set task as loading
    setLists((_prevLists) => {
      const newLists = Array.from(_prevLists);
      const listWithTask = newLists.find((l) => {
        return l.id === listId;
      }) as IProjectResultList;
      const deleteTaskIndex = listWithTask.tasks.findIndex((t) => {
        return t.id === taskId;
      }) as number;
      listWithTask.tasks[deleteTaskIndex].state =
        EnumGetProjectResultState.LOADING;
      return newLists;
    });

    //delete task on server
    deleteKanbanTask(projectId as string, listId, taskId).then((response) => {
      setLists((_prevLists) => {
        const newLists = Array.from(_prevLists);
        const listWithTask = newLists.find((l) => {
          return l.id === listId;
        }) as IProjectResultList;
        const deleteTaskIndex = listWithTask.tasks.findIndex((t) => {
          return t.id === taskId;
        }) as number;
        const [deleteTask] = listWithTask.tasks.splice(deleteTaskIndex, 1);
        return newLists;
      });
    });
  };

  const handleAddList: (name: string) => void = async (name) => {
    //create the column on the server (dont wait for response)

    setTempId((_prevTempValue) => {
      const _tempId = Number(_prevTempValue);
      setLists((_prevColumns) => {
        return [
          ..._prevColumns,
          {
            id: "temp-list-" + _tempId,
            name: name,
            tasks: [],
            state: EnumGetProjectResultState.LOADING,
          } as IProjectResultList,
        ];
      });

      createKanbanList(name, projectId as string).then((responseData) => {
        setLists((_prevColumns) => {
          //find the column
          const newColumns = Array.from(_prevColumns);
          const columnToChange = newColumns.find((c: IProjectResultList) => {
            return c.id === "temp-list-" + _tempId;
          }) as IProjectResultList;
          columnToChange.state = EnumGetProjectResultState.READY;
          columnToChange.id = responseData.project.list.id;
          return newColumns;
        });
      });
      return _prevTempValue + 1;
    });
  };

  const handleAddTask: (name: string, listId: string) => void = (
    name,
    listId
  ) => {
    setTempId((_prevTempValue) => {
      const _tempId = Number(_prevTempValue);

      //create a placeholder task
      setLists((_prevLists) => {
        const newLists = Array.from(_prevLists);
        const list = newLists.find((l) => {
          return l.id === listId;
        }) as IProjectResultList;
        list.tasks.push({
          id: "temp-task-" + _tempId,
          name: name,
          state: EnumGetProjectResultState.LOADING,
          listId: listId,
        } as IProjectResultTask);
        return newLists;
      });

      createKanbanTask(name, projectId as string, listId).then(
        (responseData) => {
          //update the placeholder task
          setLists((_prevLists) => {
            //find the column
            const newLists = Array.from(_prevLists);
            const list = newLists.find((l) => {
              return l.id === listId;
            }) as IProjectResultList;
            const taskToChange = list.tasks.find((t: IProjectResultTask) => {
              return t.id === "temp-task-" + _tempId;
            }) as IProjectResultTask;
            taskToChange.state = EnumGetProjectResultState.READY;
            taskToChange.id = responseData.project.list.task.id;
            return newLists;
          });
        }
      );
      return _prevTempValue + 1;
    });
  };

  const handleEditTask = (taskId: string, listId: string) => {
    console.log("editing task ", taskId, " from list ", listId);
  };
  const handleEditList = (listId: string) => {
    console.log("editing list ", listId);
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
              {lists.map((c: IProjectResultList, index: number) => {
                console.log("adding column", { c });
                return (
                  <KanbanBoardList
                    key={c.id}
                    id={c.id}
                    state={c.state}
                    name={c.name}
                    index={index}
                    tasks={c.tasks}
                    projectId={projectId as string}
                    handleDeleteList={handleDeleteList}
                    handleDeleteTask={handleDeleteTask}
                    handleAddTask={handleAddTask}
                    handleEditList={handleEditList}
                    handleEditTask={handleEditTask}
                  />
                );
              })}
              {provided.placeholder}
              <KanbanBoardAddButton
                type={EType.COLUMN}
                addElementCallback={handleAddList}
              />
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
};
export default KanbanBoard;
