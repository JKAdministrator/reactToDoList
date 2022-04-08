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
export default function ProjectPopup(props) {
  const { handleClose, open, isEdit, projectId } = props;
  const [state, setState] = useState("READY");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const {
    createProject,
    updateProject,
    getLanguageString,
    userOpenProjects,
    userClosedProjects,
  } = useAppContext();
  const [nameError, setNameError] = useState(false);

  function handleCloseLocally(event, reason) {
    event.preventDefault();

    switch (state) {
      case "LOADING": {
        break;
      }
      case "READY": {
        if (
          (reason &&
            (reason === "backdropClick" || reason === "escapeKeyDown")) ||
          event.target.dataset.action === "CANCEL"
        ) {
          handleClose();
          setName("");
          setNameError(false);
        } else if (event.target.dataset.action === "SAVE") {
          name && name.toString().length > 0
            ? setState("LOADING")
            : setNameError(true);
        }
        break;
      }
      case "ERROR": {
        handleClose();
        break;
      }
      default: {
        break;
      }
    }
  }

  function getString(string) {
    return getLanguageString("projectPopup", string);
  }

  useEffect(() => {
    switch (state) {
      case "LOADING": {
        setNameError(false);
        if (isEdit) {
          let newName = name;
          handleClose();
          setName("");
          setNameError(false);
          updateProject(projectId, { name: newName });
        } else {
          createProject({ name: name })
            .then((result) => {
              handleClose();
              setName("");
              setNameError(false);
            })
            .catch((e) => {
              setError(e);
              setState("ERROR");
            });
        }
        break;
      }
      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  useEffect(() => {
    if (open) {
      if (projectId != "") {
        let project = [...userOpenProjects, ...userClosedProjects].find(
          (project) => {
            return project.id === projectId;
          }
        );
        setName(project.name);
      }
      setState("READY");
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={handleCloseLocally}>
      {state === "READY" ? (
        <>
          <DialogTitle>
            {getString(isEdit ? "titleEdit" : "titleCreate")}
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
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              error={nameError}
            />
          </DialogContent>
          <DialogActions
            style={{
              justifyContent: "space-between",
            }}
          >
            <Button onClick={handleCloseLocally} data-action="CANCEL">
              {getString("buttonCancel")}
            </Button>
            <Button
              onClick={handleCloseLocally}
              data-action="SAVE"
              variant="contained"
            >
              {getString(isEdit ? "buttonSaveEdit" : "buttonSaveCreate")}
            </Button>
          </DialogActions>
        </>
      ) : (
        <></>
      )}
      {state === "LOADING" ? (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <></>
      )}
      {state === "ERROR" ? (
        <>
          <DialogContent>
            <DialogTitle>{getString("errorTitle")}</DialogTitle>
            <Typography> {error}</Typography>;
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseLocally} data-action="CANCEL">
              {getString("errorClose")}
            </Button>
          </DialogActions>
        </>
      ) : (
        <></>
      )}
    </Dialog>
  );
}
