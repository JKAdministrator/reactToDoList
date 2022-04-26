import React from "react";
import style from "./style.module.scss";
import {
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Fade from "@mui/material/Fade";
interface IHeaderProps {
  label: string;
  elementId: string;
  handleDelete: (elementId: string) => void;
  handleEdit: (elementId: string) => void;
}
enum EAction {
  DELETE = "DELETE",
  EDIT = "EDIT",
}
const Header = (props: IHeaderProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (e: React.MouseEvent<HTMLElement>) => {
    const target: HTMLElement = e.nativeEvent.target as HTMLElement;
    const action: EAction = target.getAttribute("data-action") as EAction;
    setAnchorEl(null);
    switch (action) {
      case EAction.EDIT: {
        props.handleEdit(props.elementId);
        break;
      }
      case EAction.DELETE: {
        props.handleDelete(props.elementId);
        break;
      }
      default:
        break;
    }
  };
  return (
    <Box
      style={{
        display: "flex",
        flexFlow: "row",
        alignItems: "center",
      }}
      className={style.headerContainerBox}
    >
      <Typography
        variant="body2"
        style={{ textAlign: "left", height: "max-content" }}
        gutterBottom
      >
        {props.label}
      </Typography>
      <IconButton
        aria-label="more"
        id={`kanban-element-header-menu-${props.elementId}`}
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        style={{
          marginLeft: "auto",
          opacity: "0",
          transition: "0.3s",
        }}
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="fade-menu"
        MenuListProps={{
          "aria-labelledby": "fade-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <MenuItem onClick={handleClose} data-action={EAction.EDIT}>
          <ListItemIcon style={{ pointerEvents: "none" }}>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          Edit
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose} data-action={EAction.DELETE}>
          <ListItemIcon style={{ pointerEvents: "none" }}>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};
export default Header;
