import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useAppContext } from "../../../../../context/appContext";
import style from "./style.module.scss";
import {
  Button,
  Card,
  CircularProgress,
  ListItemIcon,
  Menu,
  MenuItem,
  SvgIconTypeMap,
} from "@mui/material";
import { blueGrey, grey } from "@mui/material/colors";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

import DeleteIcon from "@mui/icons-material/Delete";
import FolderOffIcon from "@mui/icons-material/FolderOff";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import EditIcon from "@mui/icons-material/Edit";
import { OverridableComponent } from "@mui/material/OverridableComponent";

enum EnumComponentState {
  READY,
  CHANGING,
}

enum EnumAction {
  DELETE,
  RENAME,
  CLOSE,
  OPEN,
}

interface IOption {
  actionId: EnumAction;
  label: string;
  allowDelete: boolean;
  allowRename: boolean;
  allowClose: boolean;
  allowReopen: boolean;
  icon: any;
}

type ArrayOfIOptions = IOption[];

const options: ArrayOfIOptions = [
  {
    actionId: EnumAction.DELETE,
    label: "delete",
    allowDelete: true,
    allowRename: false,
    allowClose: false,
    allowReopen: false,
    icon: <DeleteIcon></DeleteIcon>,
  },
  {
    actionId: EnumAction.RENAME,
    label: "rename",
    allowDelete: false,
    allowRename: true,
    allowClose: false,
    allowReopen: false,
    icon: <EditIcon></EditIcon>,
  },
  {
    actionId: EnumAction.CLOSE,
    label: "close",
    allowDelete: false,
    allowRename: false,
    allowClose: true,
    allowReopen: false,
    icon: <FolderOffIcon></FolderOffIcon>,
  },
  {
    actionId: EnumAction.OPEN,
    label: "reopen",
    allowDelete: false,
    allowRename: false,
    allowClose: false,
    allowReopen: true,
    icon: <CreateNewFolderIcon></CreateNewFolderIcon>,
  },
];

interface IProps {
  name: string;
  id: string;
  openCallback: any;
  allowReopen: boolean;
  allowDelete: boolean;
  allowRename: boolean;
  allowClose: boolean;
  editCallback: any;
}

interface IStateObject {
  anchorEl: Element | null;
  state: EnumComponentState;
  open: boolean;
}

const ProjectTabItem: React.FC<IProps> = (props: IProps) => {
  const {
    userDarkMode,
    getLanguageString,
    closeProject,
    deleteProject,
    openProject,
  } = useAppContext();

  const [stateObject, setStateObject] = useState<IStateObject>({
    anchorEl: null,
    state: EnumComponentState.READY,
    open: Boolean(null),
  });

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setStateObject((_prevState) => {
      return {
        ..._prevState,
        anchorEl: event.currentTarget,
      };
    });
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    _action: EnumAction
  ) => {
    switch (_action) {
      case EnumAction.CLOSE: {
        setStateObject((_prevState) => {
          return {
            ..._prevState,
            state: EnumComponentState.CHANGING,
            anchorEl: null,
          };
        });
        closeProject(props.id);
        break;
      }
      case EnumAction.OPEN: {
        setStateObject((_prevState) => {
          return {
            ..._prevState,
            state: EnumComponentState.CHANGING,
            anchorEl: null,
          };
        });
        openProject(props.id);
        break;
      }
      case EnumAction.DELETE: {
        setStateObject((_prevState) => {
          return {
            ..._prevState,
            state: EnumComponentState.CHANGING,
            anchorEl: null,
          };
        });
        deleteProject(props.id);
        break;
      }
      case EnumAction.RENAME: {
        setStateObject((_prevState) => {
          return {
            ..._prevState,
            anchorEl: null,
          };
        });
        props.editCallback(props.id);
        break;
      }
      default: {
        setStateObject((_prevState) => {
          return {
            ..._prevState,
            anchorEl: null,
          };
        });
        break;
      }
    }
  };

  function getString(string: string): string {
    return getLanguageString("projectsPanelItem", string);
  }

  return (
    <Card
      className={style.projectCard}
      elevation={stateObject.state === EnumComponentState.CHANGING ? 0 : 1}
    >
      {stateObject.state === EnumComponentState.CHANGING ? (
        <CircularProgress
          style={{ position: "absolute", top: "calc(50% - 20px)" }}
        ></CircularProgress>
      ) : (
        <>
          <Button onClick={props.openCallback}>
            <Typography
              variant="body1"
              sx={
                userDarkMode ? { color: grey[100] } : { color: blueGrey[500] }
              }
            >
              {props.name}
            </Typography>
          </Button>
          <Box className={style.controlsContainer}>
            <div>
              <Button
                id="basic-button"
                aria-controls={stateObject.open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={stateObject.open ? "true" : undefined}
                onClick={handleClick}
              >
                <MoreHorizIcon></MoreHorizIcon>
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={stateObject.anchorEl}
                open={stateObject.open}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                {options
                  .filter((option: IOption) => {
                    return (
                      option.allowReopen === props.allowReopen ||
                      option.allowClose === props.allowClose ||
                      option.allowDelete === props.allowDelete ||
                      option.allowRename === props.allowRename
                    );
                  })
                  .map((option: IOption) => {
                    return (
                      <MenuItem
                        key={option.actionId}
                        onClick={(event) =>
                          handleMenuClick(event, option.actionId)
                        }
                      >
                        <ListItemIcon style={{ pointerEvents: "none" }}>
                          {option.icon}
                        </ListItemIcon>
                        {getString(option.label)}
                      </MenuItem>
                    );
                  })}
              </Menu>
            </div>
          </Box>
        </>
      )}
    </Card>
  );
};
export default ProjectTabItem;
