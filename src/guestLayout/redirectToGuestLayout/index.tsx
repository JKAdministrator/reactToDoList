import { CircularProgress } from "@mui/material";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RedirectToGuestLayout: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(`/login`);
  }, []);
  return (
    <CircularProgress
      style={{ position: "absolute", top: "calc(50% - 20px)" }}
    />
  );
};

export default RedirectToGuestLayout;
