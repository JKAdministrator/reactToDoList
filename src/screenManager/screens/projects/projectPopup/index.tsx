import {
  Backdrop,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAppContext } from "../../../../context/appContext";

interface IProps {
  handleClose: any;
  open: boolean;
  isEdit: boolean;
  projectId: string;
}

enum EnumComponentState {
  READY,
  LOADING,
  ERROR,
}

interface IStateObject {
  state: EnumComponentState;
  name: string;
  error: string;
  nameError: boolean;
}

enum EnumButtonAction {
  SAVE,
  CANCEL,
}

const ProjectPopup: React.FC<IProps> = (props: IProps) => {
  const [stateObject, setStateObject] = useState<IStateObject>({
    state: EnumComponentState.READY,
    error: "",
    name: "",
    nameError: false,
  });

  const {
    createProject,
    updateProject,
    getLanguageString,
    userOpenProjects,
    userClosedProjects,
  } = useAppContext();

  const hanldeButtonClick = (action: EnumButtonAction) => {
    switch (action) {
      case EnumButtonAction.CANCEL: {
        props.handleClose();
        setStateObject((_prevState) => {
          return {
            ..._prevState,
            name: "",
            nameError: false,
          };
        });
        break;
      }
      case EnumButtonAction.SAVE: {
        stateObject.name.length > 0
          ? setStateObject((_prevState) => {
              return {
                ..._prevState,
                state: EnumComponentState.LOADING,
              };
            })
          : setStateObject((_prevState) => {
              return {
                ..._prevState,
                nameError: true,
              };
            });
        break;
      }
      default:
        break;
    }
  };

  const handleCloseLocally = (
    event: React.MouseEvent<HTMLElement>,
    reason: string
  ): void => {
    event.preventDefault();
    switch (stateObject.state) {
      case EnumComponentState.LOADING: {
        break;
      }
      case EnumComponentState.READY: {
        if (
          reason &&
          (reason === "backdropClick" || reason === "escapeKeyDown")
        ) {
          props.handleClose();
          setStateObject((_prevState) => {
            return {
              ..._prevState,
              name: "",
              nameError: false,
            };
          });
        }
        break;
      }
      case EnumComponentState.ERROR: {
        props.handleClose();
        break;
      }
      default: {
        break;
      }
    }
  };

  function getString(string: string): string {
    return getLanguageString("projectPopup", string);
  }

  useEffect(() => {
    switch (stateObject.state) {
      case EnumComponentState.LOADING: {
        if (props.isEdit) {
          props.handleClose();
          setStateObject((_prevState) => {
            return {
              ..._prevState,
              name: "",
              nameError: false,
            };
          });
          updateProject(props.projectId, { name: stateObject.name });
        } else {
          createProject({ name: stateObject.name })
            .then((result: any) => {
              props.handleClose();
              setStateObject((_prevState) => {
                return {
                  ..._prevState,
                  name: "",
                  nameError: false,
                };
              });
            })
            .catch((e: any) => {
              setStateObject((_prevState) => {
                return {
                  ..._prevState,
                  state: EnumComponentState.ERROR,
                  error: e.toString(),
                  nameError: false,
                };
              });
            });
        }
        break;
      }
      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateObject.state]);

  useEffect(() => {
    if (props.open) {
      let name: string = "";
      if (props.projectId !== "") {
        let project = [...userOpenProjects, ...userClosedProjects].find(
          (project) => {
            return project.id === props.projectId;
          }
        );
        name = project.name;
      }

      setStateObject((_prevState) => {
        return {
          ..._prevState,
          state: EnumComponentState.READY,
          name: name,
        };
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.open]);

  return (
    <Dialog open={props.open} onClose={handleCloseLocally}>
      {stateObject.state === EnumComponentState.READY ? (
        <>
          <DialogTitle>
            {getString(props.isEdit ? "titleEdit" : "titleCreate")}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label={getString("name")}
              type="text"
              fullWidth
              variant="standard"
              required
              value={stateObject.name}
              onChange={(e) => {
                setStateObject((_prevState) => {
                  return {
                    ..._prevState,
                    name: e.target.value,
                  };
                });
              }}
              error={stateObject.nameError}
            />
          </DialogContent>
          <DialogActions
            style={{
              justifyContent: "space-between",
            }}
          >
            <Button
              data-action={EnumButtonAction.CANCEL}
              onClick={() => hanldeButtonClick(EnumButtonAction.CANCEL)}
            >
              {getString("buttonCancel")}
            </Button>

            <Button
              data-action={EnumButtonAction.SAVE}
              variant="contained"
              onClick={() => hanldeButtonClick(EnumButtonAction.SAVE)}
            >
              {getString(props.isEdit ? "buttonSaveEdit" : "buttonSaveCreate")}
            </Button>
          </DialogActions>
        </>
      ) : (
        <></>
      )}
      {stateObject.state === EnumComponentState.LOADING ? (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <></>
      )}
      {stateObject.state === EnumComponentState.ERROR ? (
        <>
          <DialogContent>
            <DialogTitle>{getString("errorTitle")}</DialogTitle>
            <Typography> {stateObject.error}</Typography>;
          </DialogContent>
          <DialogActions>
            <Button data-action={EnumButtonAction.CANCEL.toString()}>
              {getString("errorClose")}
            </Button>
          </DialogActions>
        </>
      ) : (
        <></>
      )}
    </Dialog>
  );
};
export default ProjectPopup;
