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
export default function CreateProjectPopup(props) {
  const { handleClose, open } = props;
  const [state, setState] = useState("READY");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const { createProject } = useAppContext();

  function handleCloseLocally(event, reason) {
    event.preventDefault();

    switch (state) {
      case "LOADING": {
        if (
          reason &&
          (reason === "backdropClick" || reason === "escapeKeyDown")
        )
          return;
        break;
      }
      case "READY": {
        if (
          (reason &&
            (reason === "backdropClick" || reason === "escapeKeyDown")) ||
          event.target.dataset.action === "CANCEL"
        ) {
          handleClose();
        } else if (event.target.dataset.action === "CREATE") {
          setState("LOADING");
        }
        break;
      }
      case "ERROR": {
        handleClose();
        break;
      }
      default:
        break;
    }
  }

  useEffect(() => {
    switch (state) {
      case "LOADING": {
        console.log(`creating Project [${name}]`);
        createProject({ name: name })
          .then((result) => {
            handleClose();
          })
          .catch((e) => {
            setError(e);
            setState("ERROR");
          });
        break;
      }
      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <Dialog open={open} onClose={handleCloseLocally}>
      {state === "READY" ? (
        <>
          <DialogTitle>New Project</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Name"
              type="text"
              fullWidth
              variant="standard"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseLocally} data-action="CANCEL">
              Cancel
            </Button>
            <Button onClick={handleCloseLocally} data-action="CREATE">
              Create
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
            <DialogTitle>Error</DialogTitle>
            <Typography> {error}</Typography>;
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseLocally} data-action="CANCEL">
              CLOSE
            </Button>
          </DialogActions>
        </>
      ) : (
        <></>
      )}
    </Dialog>
  );
}
