import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box, Button, IconButton, Paper, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import style from "./style.module.scss";
export enum EType {
  TASK = "TASK",
  COLUMN = "COLUMN",
}

enum EState {
  BUTTON = "BUTTON",
  INPUT = "INPUT",
}

interface IPropsAddButton {
  type: EType;
  addElementCallback: (name: string) => void;
}

const KanbanBoardAddButton = (props: IPropsAddButton) => {
  const { t } = useTranslation();
  const [state, setState] = useState(EState.BUTTON);
  const [nameInputError, setNameInputError] = useState<boolean>(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const onAddelementClick = useCallback(() => {
    if (nameInputRef?.current && nameInputRef?.current.value.length > 0) {
      setNameInputError(false);
      setState(EState.BUTTON);
      props.addElementCallback(nameInputRef?.current.value);
    } else setNameInputError(true);
  }, []);

  return (
    <>
      {state === EState.BUTTON ? (
        <Button
          variant="text"
          style={{
            justifyContent: "flex-start",
            width: "max-content",
          }}
          onClick={() => {
            setState(EState.INPUT);
          }}
        >
          {props.type === EType.TASK
            ? t("kanban-board-add-task-button-label")
            : t("kanban-board-add-list-button-label")}
        </Button>
      ) : (
        <Box
          className={style.headerContainerBox}
          sx={{
            width: "100%",
            maxWidth: "18rem",
          }}
        >
          <TextField
            id="outlined-basic"
            fullWidth
            label="Outlined"
            variant="outlined"
            inputRef={nameInputRef}
            error={nameInputError}
          />
          <Button
            variant="contained"
            onClick={onAddelementClick}
            style={{
              whiteSpace: "nowrap",
            }}
          >
            {props.type === EType.TASK
              ? t("kanban-board-add-task-button-label")
              : t("kanban-board-add-list-button-label")}
          </Button>
          <IconButton
            color="primary"
            aria-label="cancel"
            onClick={() => {
              setState(EState.BUTTON);
            }}
            style={{
              marginLeft: "auto",
              opacity: "0",
              transition: "0.3s",
            }}
          >
            <CloseOutlinedIcon />
          </IconButton>
        </Box>
      )}
    </>
  );
};
export default KanbanBoardAddButton;
