import { CircularProgress } from "@mui/material";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RedirectToUserLayout: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(`/projects`);
  }, []);
  return (
    <CircularProgress
      style={{ position: "absolute", top: "calc(50% - 20px)" }}
    />
  );
};

export default RedirectToUserLayout;
