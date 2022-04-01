import React, { useEffect, useState } from "react";
import style from "./style.module.scss";
import { useAppContext } from "../../../../context/appContext";
import noUserImage from "./noUserImage.png";
import {
  Avatar,
  Card,
  CircularProgress,
  FormGroup,
  Typography,
} from "@mui/material";

export const AppContext = React.createContext();

const SectionConfigurationAccesAccountGoogle = () => {
  const { userData } = useAppContext();
  const [dataObject, setDataObject] = useState({
    displayName: "",
    email: "",
    state: "LOADING",
  });

  useEffect(() => {
    let loginData = userData.logins.find((l) => {
      return l.source === "google";
    });
    if (loginData) {
      setDataObject((_prevData) => {
        return { ..._prevData, ...loginData, state: "READY" };
      });
    } else {
      setDataObject((_prevData) => {
        return { ..._prevData, ...loginData, state: "EMPTY" };
      });
    }
  }, []);

  function handleDeleteClick(e) {
    setDataObject((_prevData) => {
      return { ..._prevData, state: "DELETING" };
    });
  }
  /**
   *backgroundColor: "#f7f7f7"
   */
  return (
    <>
      {dataObject.state === "READY" || dataObject.state === "DELETING" ? (
        <Card variant="outlined" sx={{}}>
          <FormGroup className={style.googleCard}>
            <Typography variant="h7" component="h3" style={{ gridArea: "a1" }}>
              Google
            </Typography>
            <Avatar
              alt="Google user image"
              src={dataObject.photoURL ? dataObject.photoURL : noUserImage}
              style={{
                gridArea: "a2",
                margin: "0.5rem",
                justifySelf: "center",
              }}
              sx={{ width: 80, height: 80 }}
            />
            <Typography variant="body2" gutterBottom style={{ gridArea: "a3" }}>
              {dataObject ? dataObject.displayName : ""}
            </Typography>
            <Typography variant="body2" gutterBottom style={{ gridArea: "a4" }}>
              {dataObject ? dataObject.email : ""}
            </Typography>
          </FormGroup>
        </Card>
      ) : (
        <></>
      )}

      {dataObject.state === "LOADING" ? (
        <div className={style.loaderContainer}>
          <CircularProgress />
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default SectionConfigurationAccesAccountGoogle;
